# Reddit Scraper

Reddit Scraper for fetching posts and comments via the official API.

* Built with zero-dependencies
* Available as CLI
* Available as TypeScript library
* Automatically caches and fetches only changed posts and comments

## Installation

### Global installation (recommended for CLI usage)

```bash
npm install -g reddit-scraper
```

### Using npx (no installation required)

```bash
npx reddit-scraper --subreddit improv --verbose
```

### As a library in your project

```bash
npm install reddit-scraper
```

## Usage

### CLI

After global installation:

```bash
reddit-scraper --subreddit improv --verbose
```

Or using npx:

```bash
npx reddit-scraper --subreddit improv --max-posts 50 --max-days 30
```

### CLI Options

```
Required:
  -s, --subreddit <name>    Subreddit name (without r/)

Options:
  -p, --max-posts <number>  Maximum number of posts to scrape (default: 100)
  -d, --max-days <number>   Number of days back to scrape (default: 7)
  -v, --verbose             Enable verbose/debug logging
  -h, --help                Show this help message
```

### As a library

```typescript
import { scrapeSubreddit } from 'reddit-scraper';

await scrapeSubreddit({
  subreddit: 'improv',
  maxPostCount: 100,
  maxPostAge: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60) // 7 days ago
});
```

## Developers: Getting started

```bash
npm install
```

Run the scraper in development mode:

```bash
npm run dev -- --subreddit improv --verbose
```

Build the project:

```bash
npm run build
```

## Configuration

Create a `.env` file with your Reddit API credentials:

```bash
REDDIT_CLIENT_ID=your_client_id
REDDIT_SECRET=your_secret
```

See "Create Reddit App" section below for instructions on obtaining credentials.

## API documentation

- This project is heavily using https://www.reddit.com/dev/api#GET_new
- See [Official API Definition](https://www.reddit.com/dev/api/)

## Create Reddit App

- Created a Reddit app with your account in https://old.reddit.com/prefs/apps/
- Copy client id and secret into the `.env` file
