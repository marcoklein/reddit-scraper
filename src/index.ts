import { loadEnv } from "./load-env.js";
loadEnv();

export { scrapeSubreddit } from "./scrape.js";
export { scrapeMultipleSubreddits } from "./scrape-multiple.js";

export type { ScrapeSubredditOptions } from "./scrape.js";
export type {
  ScrapeMultipleSubredditsOptions,
  ScrapeResult,
  ScrapeMultipleResults
} from "./scrape-multiple.js";
export type { Post, Comment } from "./types.js";
