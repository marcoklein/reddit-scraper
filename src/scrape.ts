import { delay } from "./delay.js";
import { getLogger } from "./logger.js";
import {
  getAccessToken,
} from "./reddit-api.js";
import { processBatch } from "./process-batch.js";

export interface ScrapeSubredditOptions {
  /**
   * Name of subreddit (withou /r/).
   *
   * @example improv
   */
  subreddit: string
  /**
   * Stop after fetching this amount of posts.
   *
   * @see maxPostAge
   * @default 100
     */
  maxPostCount?: number
  /**
   * UTC timestamp in seconds of the oldest post to scrape (will stop after reaching that post).
   *
   * Use this on subsequent scrapes to only fetch the most recent posts that might have changes in comments.
   *
   * @see maxPostCount
   * @default Last seven days (`Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60`)
   */
  maxPostAge?: number;
}


function validateOptions({ subreddit, maxPostCount, maxPostAge }: ScrapeSubredditOptions) {

  if (subreddit.includes(('r/')))
    throw new Error(`Invalid subreddit: subreddit option must not contain r/ (${subreddit} provided)`)
  if (subreddit.trim().length === 0)
    throw new Error(`Invalid subreddit: subreddit option must not be empty`)


  if (maxPostCount && maxPostCount <= 0) throw new Error(`Invalid maxPostCount: must be 1 or more (${maxPostCount} provided)`)


  if (maxPostAge) {
    const currentSeconds = Math.floor(Date.now() / 100)
    if (maxPostAge > currentSeconds) {
      throw new Error(`Invalid maxPostAge: maxPostAge is in the future. Current time in seconds is ${currentSeconds} but ${maxPostAge} was provided.`)
    }
  }
}

export async function scrapeSubreddit(options: ScrapeSubredditOptions): Promise<void> {
  validateOptions(options)

  const logger = getLogger();
  const subreddit = options.subreddit.trim();
  const maxPostAge = options.maxPostAge ?? Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60

  const maxPostCount = options.maxPostCount ?? 100

  let lastAfter: string | null = null;
  let currentNumberOfFetchedPosts = 0;

  const MAX_FETCH_COUNT_PER_BATCH = 100
  const batchSize = Math.min(maxPostCount, MAX_FETCH_COUNT_PER_BATCH)

  logger.info(`Starting scrape with options: ${JSON.stringify({ subreddit, maxPostAge, maxPostCount })}`)

  const accessToken = await getAccessToken();
  while (true) {
    const {
      after: newAfter,
      fetchedPostsCount,
      oldestDate: oldestTimestamp,
    } = await processBatch(subreddit, accessToken, batchSize, lastAfter ?? undefined);

    currentNumberOfFetchedPosts += fetchedPostsCount;

    logger.info(
      `Successfully fetched another ${fetchedPostsCount} posts (now ${currentNumberOfFetchedPosts} in total).`
    );
    if (oldestTimestamp < maxPostAge) {
      logger.info(`Reached posts older than provided max age (${maxPostAge}). Stopping.`);
      break;
    }
    if (lastAfter === newAfter) {
      lastAfter = newAfter;
      logger.info("Reached maximum number of posts Reddit allows the API to scrape. Stopping.")
      break;
    }
    if (currentNumberOfFetchedPosts >= maxPostCount) {
      logger.info("Reached maximum number of posts to scrape. Stopping.")
      break;
    }
  }
}

