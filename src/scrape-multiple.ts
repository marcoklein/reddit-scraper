import { setGlobalLogger, Logger, getLogger } from "./logger.js";
import { scrapeSubreddit } from "./scrape.js";

export interface ScrapeMultipleSubredditsOptions {
  /**
   * List of subreddit names (without r/).
   * 
   * @example ["improv", "comedy", "standupcomedy"]
   */
  subreddits: string[];
  /**
   * Maximum number of posts to scrape per subreddit.
   * 
   * @default 100
   */
  maxPostCount?: number;
  /**
   * Number of days back to scrape from now.
   * This will be converted to maxPostAge internally.
   * Cannot be used together with maxPostAge.
   * 
   * @default 7
   */
  maxDays?: number;
  /**
   * UTC timestamp in seconds of the oldest post to scrape.
   * Cannot be used together with maxDays.
   * If neither maxDays nor maxPostAge is provided, defaults to 7 days back.
   */
  maxPostAge?: number;
  /**
   * Enable verbose/debug logging.
   * 
   * @default false
   */
  enableDebug?: boolean;
  /**
   * Directory to store scraped posts.
   * 
   * @default "./results"
   */
  storageDirectory?: string;
}

export interface ScrapeResult {
  /**
   * Name of the subreddit that was scraped.
   */
  subreddit: string;
  /**
   * Whether the scrape was successful.
   */
  success: boolean;
  /**
   * Error that occurred during scraping, if any.
   */
  error?: Error;
}

export interface ScrapeMultipleResults {
  /**
   * Individual results for each subreddit.
   */
  results: ScrapeResult[];
  /**
   * Number of subreddits successfully scraped.
   */
  successCount: number;
  /**
   * Number of subreddits that failed to scrape.
   */
  failureCount: number;
}

/**
 * Scrape multiple subreddits sequentially with error handling.
 * 
 * @param options - Configuration options for scraping
 * @returns Results for each subreddit including success/failure status
 * 
 * @example
 * ```typescript
 * import { scrapeMultipleSubreddits } from 'reddit-scraper';
 * 
 * const results = await scrapeMultipleSubreddits({
 *   subreddits: ['improv', 'comedy'],
 *   maxPostCount: 50,
 *   maxDays: 7,
 *   enableDebug: false
 * });
 * 
 * console.log(`${results.successCount} succeeded, ${results.failureCount} failed`);
 * ```
 */
export async function scrapeMultipleSubreddits(
  options: ScrapeMultipleSubredditsOptions
): Promise<ScrapeMultipleResults> {
  const { subreddits, maxPostCount, maxDays, maxPostAge, enableDebug, storageDirectory } = options;

  // Validate inputs
  if (!subreddits || subreddits.length === 0) {
    throw new Error("subreddits array must contain at least one subreddit");
  }

  if (maxDays !== undefined && maxPostAge !== undefined) {
    throw new Error("Cannot specify both maxDays and maxPostAge - use only one");
  }

  // Configure logger if debug mode is specified
  if (enableDebug !== undefined) {
    setGlobalLogger(new Logger({ enableDebug }));
  }

  // Calculate maxPostAge from maxDays if needed
  let finalMaxPostAge: number | undefined;
  if (maxDays !== undefined) {
    finalMaxPostAge = Math.floor(Date.now() / 1000) - (maxDays * 24 * 60 * 60);
  } else if (maxPostAge !== undefined) {
    finalMaxPostAge = maxPostAge;
  } else {
    const defaultMaxDays = 7
    finalMaxPostAge = Math.floor(Date.now() / 1000) - (defaultMaxDays * 24 * 60 * 60);
  }

  const logger = getLogger();
  const results: ScrapeResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < subreddits.length; i++) {
    const subreddit = subreddits[i];
    logger.info(`\nScraping subreddit ${i + 1}/${subreddits.length}: ${subreddit}`);

    try {
      await scrapeSubreddit({
        subreddit,
        maxPostCount,
        maxPostAge: finalMaxPostAge,
        storageDirectory,
      });

      results.push({
        subreddit,
        success: true,
      });
      successCount++;
    } catch (error) {
      const err = error as Error;
      results.push({
        subreddit,
        success: false,
        error: err,
      });
      failureCount++;
      logger.error(`Failed to scrape ${subreddit}: ${err.message}`);
    }
  }

  if (subreddits.length > 1) {
    logger.info(`\nScraping complete: ${successCount} succeeded, ${failureCount} failed`);
  }

  return {
    results,
    successCount,
    failureCount,
  };
}
