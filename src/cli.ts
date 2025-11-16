#!/usr/bin/env node
import { loadEnv } from "./load-env.js";
loadEnv(); // Load .env before anything else

import { scrapeMultipleSubreddits } from "./scrape-multiple.js";

interface CliArgs {
  subreddits?: string[];
  maxPosts?: number;
  maxDays?: number;
  verbose?: boolean;
  help?: boolean;
  output?: string;
}

function showHelp(): void {
  console.log(`
Usage: reddit-scraper --subreddit <name> [options]

Required:
  -s, --subreddit <name>      Subreddit name (without r/)
      --subreddits <names>    Comma-separated list of subreddits
                              Both flags work the same way and support single or multiple subreddits

Options:
  -p, --max-posts <number>    Maximum number of posts to scrape per subreddit (default: 100)
  -d, --max-days <number>     Number of days back to scrape (default: 7)
  -o, --output <path>         Directory to store scraped posts (default: "./results" or STORAGE_PATH env var)
  -v, --verbose               Enable verbose/debug logging
  -h, --help                  Show this help message

Examples:
  # Scrape single subreddit
  reddit-scraper --subreddit improv

  # Scrape multiple subreddits
  reddit-scraper --subreddit improv,comedy,standupcomedy

  # Use custom output directory
  reddit-scraper --subreddit improv --output ./my-data
`);
}

function parseArgs(args: string[]): CliArgs {
  const parsed: CliArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-s":
      case "--subreddit":
      case "--subreddits":
        const value = args[++i];
        parsed.subreddits = value
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        break;
      case "-p":
      case "--max-posts":
        parsed.maxPosts = parseInt(args[++i], 10);
        break;
      case "-d":
      case "--max-days":
        parsed.maxDays = parseInt(args[++i], 10);
        break;
      case "-o":
      case "--output":
        parsed.output = args[++i];
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

  if (!args.subreddits || args.subreddits.length === 0) {
    console.error("Error: --subreddit or --subreddits is required\n");
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

  // Determine storage directory: CLI flag > environment variable > default
  const storageDirectory = args.output || process.env.STORAGE_PATH;

  await scrapeMultipleSubreddits({
    subreddits: args.subreddits,
    maxPostCount: args.maxPosts,
    maxDays: args.maxDays,
    enableDebug: args.verbose ?? false,
    storageDirectory,
  });
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
