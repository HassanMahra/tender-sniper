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
ANALYSIS_PROMPT = """Analysiere diese Ausschreibung. Antworte NUR mit validem JSON: { "titel": string, "budget": string (oder "k.A."), "ort": string, "frist": string, "gewerk": string, "fazit": string (max 10 Worte) }.

Titel: {title}

Beschreibung: {description}
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


def clean_html(text: str) -> str:
    """Remove HTML tags from text."""
    clean = re.sub(r'<[^>]+>', '', text)
    clean = re.sub(r'\s+', ' ', clean)
    return clean.strip()


async def analyze_tender_async(model: genai.GenerativeModel, title: str, description: str) -> dict | None:
    """
    Send tender to Gemini for analysis asynchronously.
    """
    prompt = ANALYSIS_PROMPT.format(
        title=title,
        description=description[:2000]
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
    
    # 2. Analyze
    analysis = await analyze_tender_async(model, title, description)
    
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
        analysis_data=analysis,
        source=RSS_FEED_URL,
        published_at=published,
        link=link
    )
    print(f"   ✅ Saved: {analysis.get('fazit', 'Saved')}")


async def main():
    print("=" * 60)
    print("🎯 TenderSniper - Async Scraper")
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
            
            # Process entries
            # We process them sequentially or in parallel? 
            # Parallel is faster but might hit rate limits. 
            # Let's do a semaphore if needed, but for MAX_ENTRIES=5, gather is fine.
            
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
