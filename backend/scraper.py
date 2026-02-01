"""
TenderSniper - Public Tender Scraper (Async)
============================================

This module handles scraping and parsing of public tenders from bund.de
and analyzes them using Google Gemini AI.

Usage:
    export GOOGLE_API_KEY="your-api-key"
    python scraper.py

Author: TenderSniper Team
"""

import os
import json
import re
import asyncio
import aiohttp
from datetime import datetime

import feedparser
import google.generativeai as genai

import database

# Configuration
RSS_FEED_URL = "https://www.service.bund.de/Content/RSS/Bund/Ausschreibungen/Bauauftraege/RSS_Bauauftraege.xml"
MAX_ENTRIES = 5
MODEL_NAME = "gemini-2.0-flash"

# Gemini prompt template for tender analysis
ANALYSIS_PROMPT = """Analysiere diese Ausschreibung basierend auf dem vollständigen Text. Antworte NUR mit validem JSON: { "titel": string, "budget": string (oder "k.A."), "ort": string, "frist": string, "gewerk": string, "fazit": string (max 10 Worte) }.

Titel: {title}

Vollständiger Text: {full_text}
"""


def setup_gemini() -> genai.GenerativeModel:
    """Configure and return Gemini AI model."""
    api_key = os.environ.get("GOOGLE_API_KEY")
    
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY environment variable is not set. "
            "Please set it with: export GOOGLE_API_KEY='your-api-key'"
        )
    
    genai.configure(api_key=api_key)
    
    generation_config = {
        "temperature": 0.1,
        "max_output_tokens": 500,
    }
    
    return genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=generation_config
    )


async def fetch_feed_text(session: aiohttp.ClientSession, url: str) -> str:
    """Fetch RSS feed content asynchronously."""
    print(f"📡 Fetching RSS feed from: {url}")
    async with session.get(url) as response:
        response.raise_for_status()
        return await response.text()


async def fetch_full_text(session: aiohttp.ClientSession, url: str) -> str:
    """Fetch and extract full text from the tender URL."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        async with session.get(url, headers=headers, timeout=15) as response:
            if response.status != 200:
                print(f"⚠️  HTTP {response.status} for {url}")
                return ""
            html = await response.text()
            
            # Remove scripts and styles
            clean = re.sub(r'<script\b[^>]*>([\s\S]*?)</script>', '', html, flags=re.IGNORECASE)
            clean = re.sub(r'<style\b[^>]*>([\s\S]*?)</style>', '', clean, flags=re.IGNORECASE)
            clean = re.sub(r'<!--[\s\S]*?-->', '', clean)
            
            # Remove HTML tags
            clean = re.sub(r'<[^>]+>', ' ', clean)
            
            # Collapse whitespace
            clean = re.sub(r'\s+', ' ', clean).strip()
            
            return clean
    except Exception as e:
        print(f"⚠️  Failed to fetch deep content for {url}: {e}")
        return ""


def clean_html(text: str) -> str:
    """Remove HTML tags from text."""
    clean = re.sub(r'<[^>]+>', '', text)
    clean = re.sub(r'\s+', ' ', clean)
    return clean.strip()


async def analyze_tender_async(model: genai.GenerativeModel, title: str, full_text: str) -> dict | None:
    """
    Send tender to Gemini for analysis asynchronously.
    """
    # Gemini 2.0 Flash has a large context window
    prompt = ANALYSIS_PROMPT.format(
        title=title,
        full_text=full_text[:20000] 
    )
    
    try:
        # Async generation
        response = await model.generate_content_async(prompt)
        response_text = response.text.strip()
        
        # Extract JSON
        if "```json" in response_text:
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        elif "```" in response_text:
            json_match = re.search(r'```\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        
        return json.loads(response_text)
        
    except json.JSONDecodeError:
        print(f"   ❌ JSON parsing failed for: {title[:30]}...")
        return None
    except Exception as e:
        print(f"   ❌ Analysis error: {e}")
        return None


async def process_entry(session: aiohttp.ClientSession, model: genai.GenerativeModel, entry: dict):
    """Process a single feed entry: check DB, analyze, save."""
    title = entry.get("title", "Unbekannter Titel")
    link = entry.get("link", "")
    published = entry.get("published", "")
    
    # 1. Idempotency Check
    if database.tender_exists(link):
        print(f"⏭️  Skipping existing: {title[:50]}...")
        return

    print(f"🔍 Analyzing: {title[:50]}...")
    
    description = clean_html(entry.get("description", entry.get("summary", "")))
    
    # 1.5 Deep Scraping
    full_text = ""
    if link:
        print(f"   ⬇️  Deep scraping: {link}")
        full_text = await fetch_full_text(session, link)
    
    if not full_text:
        full_text = description
        print("   ⚠️  Using summary description as full text.")

    # 2. Analyze
    analysis = await analyze_tender_async(model, title, full_text)
    
    if not analysis:
        # Fallback for failed analysis
        analysis = {
            "fazit": "Analyse fehlgeschlagen",
            "error": True
        }
    
    # Add metadata to analysis
    analysis["original_title"] = title
    analysis["scraped_at"] = datetime.now().isoformat()
    
    # 3. Save to DB
    database.insert_tender(
        title=title,
        description=description,
        full_text=full_text,
        analysis_data=analysis,
        source=RSS_FEED_URL,
        published_at=published,
        link=link
    )
    print(f"   ✅ Saved: {analysis.get('fazit', 'Saved')}")


async def main():
    print("=" * 60)
    print("🎯 TenderSniper - Async Scraper (Deep Mode)")
    print("=" * 60)
    
    # Setup
    try:
        database.init_db()
        model = setup_gemini()
    except ValueError as e:
        print(f"❌ Setup failed: {e}")
        return

    # Fetch
    async with aiohttp.ClientSession() as session:
        try:
            xml_text = await fetch_feed_text(session, RSS_FEED_URL)
            feed = feedparser.parse(xml_text)
            
            if not feed.entries:
                print("❌ No entries found.")
                return
                
            print(f"✅ Found {len(feed.entries)} entries.")
            print("-" * 40)
            
            tasks = []
            for entry in feed.entries[:MAX_ENTRIES]:
                tasks.append(process_entry(session, model, entry))
            
            await asyncio.gather(*tasks)

        except Exception as e:
            print(f"❌ Error during execution: {e}")

    print("-" * 40)
    print("✨ Done.")

if __name__ == "__main__":
    asyncio.run(main())
