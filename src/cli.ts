#!/usr/bin/env node
import { loadEnv } from "./load-env.js";
loadEnv(); // Load .env before anything else

import { setGlobalLogger, Logger } from "./logger.js";
import { scrapeSubreddit } from "./scrape.js";

interface CliArgs {
  subreddit?: string;
  maxPosts?: number;
  maxDays?: number;
  verbose?: boolean;
  help?: boolean;
}

function showHelp(): void {
  console.log(`
Usage: reddit-scraper --subreddit <name> [options]

Required:
  -s, --subreddit <name>    Subreddit name (without r/)

Options:
  -p, --max-posts <number>  Maximum number of posts to scrape (default: 100)
  -d, --max-days <number>   Number of days back to scrape (default: 7)
  -v, --verbose             Enable verbose/debug logging
  -h, --help                Show this help message

Examples:
  # Scrape last 7 days from r/improv (quiet mode)
  reddit-scraper --subreddit improv

  # Scrape 50 posts from last 30 days with verbose logging
  reddit-scraper -s improv -p 50 -d 30 -v
`);
}

function parseArgs(args: string[]): CliArgs {
  const parsed: CliArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-s":
      case "--subreddit":
        parsed.subreddit = args[++i];
        break;
      case "-p":
      case "--max-posts":
        parsed.maxPosts = parseInt(args[++i], 10);
        break;
      case "-d":
      case "--max-days":
        parsed.maxDays = parseInt(args[++i], 10);
        break;
      case "-v":
      case "--verbose":
        parsed.verbose = true;
        break;
      case "-h":
      case "--help":
        parsed.help = true;
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  return parsed;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (!args.subreddit) {
    console.error("Error: --subreddit is required\n");
    showHelp();
    process.exit(1);
  }

  if (args.maxPosts !== undefined && (isNaN(args.maxPosts) || args.maxPosts <= 0)) {
    console.error(`Error: --max-posts must be a positive number (got: ${args.maxPosts})`);
    process.exit(1);
  }

  if (args.maxDays !== undefined && (isNaN(args.maxDays) || args.maxDays <= 0)) {
    console.error(`Error: --max-days must be a positive number (got: ${args.maxDays})`);
    process.exit(1);
  }

  setGlobalLogger(new Logger({ enableDebug: args.verbose ?? false }));

  const maxDays = args.maxDays ?? 7;
  const maxPostAge = Math.floor(Date.now() / 1000) - (maxDays * 24 * 60 * 60);

  await scrapeSubreddit({
    subreddit: args.subreddit,
    maxPostCount: args.maxPosts,
    maxPostAge,
  });
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
