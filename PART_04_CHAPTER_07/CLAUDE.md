# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"오늘의 명언" (Quote of the Day) - A web service for browsing and searching inspirational quotes. The project uses a static HTML/CSS/JavaScript frontend with Supabase PostgreSQL as the backend database.

## Architecture

### Project Structure

```
PART_04_CHAPTER_07/
├── quotes-website/          # Frontend static website
│   ├── index.html           # Main HTML structure
│   ├── app.js               # Core application logic
│   ├── styles.css           # Styling
│   └── quotes.json          # Local fallback data (to be replaced with Supabase API)
├── migration/               # Database migration tools
│   ├── upload-to-supabase.js  # Script to upload quotes to Supabase
│   ├── package.json         # Node.js dependencies (@supabase/supabase-js, dotenv)
│   └── .env                 # Supabase credentials (not committed)
├── quotes.json              # Source data (2000 quotes from Hugging Face Quotes-500K dataset)
└── .mcp.json                # Supabase MCP configuration for Claude Code
```

### Data Flow

1. **Source Data**: `quotes.json` (2000 quotes) derived from Hugging Face Quotes-500K dataset
2. **Database**: Supabase PostgreSQL with `quotes` table
3. **Frontend**: Currently reads from local `quotes.json`, needs to be migrated to Supabase API

### Database Schema

Table: `public.quotes`
- `id`: bigint (primary key, auto-increment)
- `quote`: text (the quote content)
- `author`: text (author name)
- `category`: text (quote category)
- `created_at`: timestamp with time zone

**Indexes:**
- `idx_quotes_author`: B-tree index on author for fast filtering
- `idx_quotes_category`: B-tree index on category for fast filtering
- `idx_quotes_search`: GIN index on quote text for full-text search

**RLS Policies:**
- Public read access (SELECT)
- Authenticated write access (INSERT)

## Development Commands

### Running the Frontend

The frontend is a static website. Open directly in browser:
```bash
open quotes-website/index.html
```

Or serve via simple HTTP server:
```bash
cd quotes-website
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Database Migration

Upload quotes data to Supabase:
```bash
cd migration
npm install                    # Install dependencies (first time only)
# Ensure .env is configured with SUPABASE_URL and SUPABASE_ANON_KEY
npm run upload                 # Run upload script
```

The upload script:
- Reads `quotes.json` from parent directory
- Uploads in batches of 100 for performance
- Shows real-time progress bar
- Handles errors gracefully

### Supabase MCP Operations

Use these MCP tools directly in Claude Code:

```javascript
// List tables
mcp__supabase__list_tables

// Execute SQL queries (for testing)
mcp__supabase__execute_sql({ query: "SELECT COUNT(*) FROM quotes" })

// Apply migrations (for schema changes)
mcp__supabase__apply_migration({
  name: "add_column_xyz",
  query: "ALTER TABLE quotes ADD COLUMN xyz TEXT"
})

// Get project credentials
mcp__supabase__get_project_url
mcp__supabase__get_anon_key
```

## Key Implementation Details

### Frontend State Management

The app uses a simple global state pattern:
- `allQuotes`: Array of all loaded quotes
- `currentQuote`: Currently displayed quote
- `searchTimeout`: Debounce timer for search

### Search Implementation

The search function (`performSearch`) searches across:
- Quote text
- Author name
- Category

Results are limited to 50 cards for performance, with case-insensitive matching and search term highlighting.

### Animation System

- **Random Quote**: Fade out → load new data → fade in (500ms transition)
- **Search Results**: Staggered animation with 50ms delay per card
- Uses CSS transitions and `animationDelay`

### Keyboard Shortcuts

- `Cmd/Ctrl + K`: Focus search input
- `Cmd/Ctrl + R`: Random quote
- `Esc`: Clear search

## Next Steps (from note.md)

The project is currently at step 4 (data migration complete). Remaining tasks:

5. **Supabase API Integration** - Replace local `quotes.json` with Supabase API calls
6. **Enhanced Search** - Add filters for author, keyword, category
7. **UI Design Polish** - Improve typography, colors, layout (reference v0)
8. **Social Sharing** - Twitter share, image download, clipboard copy

## Important Notes

- **Data Source**: The 2000 quotes in `quotes.json` are sampled from Hugging Face's Quotes-500K dataset (jstet/quotes-500k)
- **Current State**: Frontend reads from local JSON; database has 2000 quotes but API integration is pending
- **MCP Connection**: Supabase MCP is configured in `.mcp.json` for direct database operations via Claude Code
- **Migration Pattern**: Use `migration/` directory for all data seeding and schema changes
