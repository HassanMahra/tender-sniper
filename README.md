# TenderSniper

TenderSniper is a platform for automating the discovery and analysis of public tenders (Ausschreibungen). It combines a modern Next.js frontend with a Python-based scraper and analysis engine powered by Google Gemini AI.

## Features

-   **Automated Scraping**: Fetches public tenders from sources like `bund.de`.
-   **AI Analysis**: Uses Google Gemini AI to summarize tenders and extract key details (budget, location, deadline).
-   **Modern UI**: Clean and responsive interface built with Next.js and Tailwind CSS.
-   **Search & Filter**: Easily find relevant tenders.

## Project Structure

-   `src/`: Next.js Frontend application.
-   `backend/`: Python backend scripts (scraper, database, API).
-   `backend/tenders.db`: SQLite database storing tender data.

## Prerequisites

-   Node.js (v18 or higher)
-   Python (3.8 or higher)
-   A Google Cloud API Key for Gemini (Generative AI)

## Setup

### 1. Frontend Setup

Install the Node.js dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

(Optional) Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Running the Scraper

To fetch and analyze tenders, you need to run the scraper script. Make sure you have your Google API Key ready.

```bash
export GOOGLE_API_KEY="your-api-key-here"
python scraper.py
```

The scraper will:
1.  Fetch the RSS feed from `bund.de`.
2.  Check for new tenders.
3.  Download the full text.
4.  Analyze the content using Gemini AI.
5.  Save the results to `tenders.db`.

### 4. Running the Backend API (Optional)

The frontend currently reads directly from the SQLite database via Server Actions/API Routes in development, but a FastAPI backend is also available for future expansion.

```bash
python main.py
```

The API will be available at `http://localhost:8000`.

## Configuration

-   **Frontend**: `next.config.ts`, `tailwind.config.ts` (via postcss)
-   **Backend**: `backend/scraper.py` (Edit `RSS_FEED_URL` or `MAX_ENTRIES` to customize scraping behavior)

## License

Private
