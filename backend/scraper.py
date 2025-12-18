"""
TenderSniper - Public Tender Scraper
=====================================

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
from pathlib import Path
from datetime import datetime

import feedparser
import google.generativeai as genai


# Configuration
RSS_FEED_URL = "https://www.service.bund.de/Content/RSS/Bund/Ausschreibungen/Bauauftraege/RSS_Bauauftraege.xml"
OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data"
OUTPUT_FILE = OUTPUT_DIR / "tenders.json"
MAX_ENTRIES = 3
MODEL_NAME = "gemini-2.0-flash"  # Cost-effective model

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
    
    # Configure generation settings for JSON output
    generation_config = {
        "temperature": 0.1,  # Low temperature for consistent JSON
        "max_output_tokens": 500,
    }
    
    return genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=generation_config
    )


def fetch_rss_feed(url: str) -> list[dict]:
    """Fetch and parse RSS feed from bund.de."""
    print(f"📡 Fetching RSS feed from: {url}")
    
    feed = feedparser.parse(url)
    
    if feed.bozo:
        # bozo flag indicates parsing errors
        print(f"⚠️  Warning: Feed parsing had issues: {feed.bozo_exception}")
    
    if not feed.entries:
        raise ValueError("No entries found in RSS feed")
    
    print(f"✅ Found {len(feed.entries)} entries in feed")
    return feed.entries


def clean_html(text: str) -> str:
    """Remove HTML tags from text."""
    clean = re.sub(r'<[^>]+>', '', text)
    clean = re.sub(r'\s+', ' ', clean)
    return clean.strip()


def analyze_tender(model: genai.GenerativeModel, title: str, description: str) -> dict | None:
    """
    Send tender to Gemini for analysis and return structured data.
    Returns None if analysis fails.
    """
    prompt = ANALYSIS_PROMPT.format(
        title=title,
        description=description[:2000]  # Limit description length
    )
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        if "```json" in response_text:
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        elif "```" in response_text:
            json_match = re.search(r'```\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        
        # Parse JSON response
        result = json.loads(response_text)
        return result
        
    except json.JSONDecodeError as e:
        print(f"   ❌ JSON parsing failed: {e}")
        print(f"   Raw response: {response_text[:200]}...")
        return None
    except Exception as e:
        print(f"   ❌ Gemini API error: {e}")
        return None


def save_results(results: list[dict], output_file: Path) -> None:
    """Save analyzed tenders to JSON file."""
    # Ensure output directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Add metadata
    output_data = {
        "lastUpdated": datetime.now().isoformat(),
        "source": RSS_FEED_URL,
        "count": len(results),
        "tenders": results
    }
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Saved {len(results)} tenders to: {output_file}")


def main():
    """Main scraper execution flow."""
    print("=" * 60)
    print("🎯 TenderSniper - Ausschreibungs-Scraper")
    print("=" * 60)
    print()
    
    # Step 1: Setup Gemini
    try:
        print("🤖 Setting up Gemini AI...")
        model = setup_gemini()
        print(f"✅ Using model: {MODEL_NAME}")
        print()
    except ValueError as e:
        print(f"❌ Setup failed: {e}")
        return
    
    # Step 2: Fetch RSS feed
    try:
        entries = fetch_rss_feed(RSS_FEED_URL)
    except Exception as e:
        print(f"❌ Failed to fetch RSS feed: {e}")
        return
    
    # Step 3: Process first N entries
    print()
    print(f"📊 Analyzing top {MAX_ENTRIES} entries...")
    print("-" * 40)
    
    results = []
    
    for i, entry in enumerate(entries[:MAX_ENTRIES], start=1):
        title = entry.get("title", "Unbekannter Titel")
        description = clean_html(entry.get("description", entry.get("summary", "")))
        link = entry.get("link", "")
        published = entry.get("published", "")
        
        print(f"\n[{i}/{MAX_ENTRIES}] {title[:60]}...")
        print(f"   📅 Published: {published}")
        
        # Analyze with Gemini
        analysis = analyze_tender(model, title, description)
        
        if analysis:
            print(f"   ✅ Analysis complete")
            print(f"   📍 Ort: {analysis.get('ort', 'k.A.')}")
            print(f"   💶 Budget: {analysis.get('budget', 'k.A.')}")
            print(f"   🔧 Gewerk: {analysis.get('gewerk', 'k.A.')}")
            
            # Add source metadata
            analysis["source_url"] = link
            analysis["published"] = published
            analysis["scraped_at"] = datetime.now().isoformat()
            
            results.append(analysis)
        else:
            print(f"   ⚠️  Skipping entry due to analysis failure")
            # Still save basic info even if analysis failed
            results.append({
                "titel": title,
                "budget": "k.A.",
                "ort": "k.A.",
                "frist": "k.A.",
                "gewerk": "k.A.",
                "fazit": "Analyse fehlgeschlagen",
                "source_url": link,
                "published": published,
                "scraped_at": datetime.now().isoformat(),
                "error": True
            })
    
    # Step 4: Save results
    print()
    print("-" * 40)
    
    if results:
        save_results(results, OUTPUT_FILE)
    else:
        print("❌ No results to save")
    
    print()
    print("✨ Scraping complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
