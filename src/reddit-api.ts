import type { RedditCommentListing, RedditListing } from "./types-api.js";
import { delay } from "./delay.js";

/**
 * Milliseconds to wait before issuing a fetch.
 */
const DEFAULT_FETCH_DELAY = 500;
const DEFAULT_USER_AGENT = "reddit-dump/0.1 by reddit-dump"

/**
 * Get OAuth2 access token from Reddit API
 */
export async function getAccessToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_SECRET;

  if (!clientId || !secret) {
    throw new Error(
      "Missing REDDIT_CLIENT_ID or REDDIT_SECRET environment variables"
    );
  }

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": DEFAULT_USER_AGENT,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get authorization token: ${response.status} ${response.statusText}`
    );
  }

  const result = (await response.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  };

  return result.access_token;
}

/**
 * Fetch a batch of posts from Reddit.
 *
 * @param accessToken Access token retrieved by getAccessToken()
 * @param subreddit Name of subreddit (without any /r/ prefix)
 * @param limit Max number of entries to return
 * @param after Provide this to fetch entries after this id. Provided by the response of the function.
 */
export async function fetchNewestPostsBatch(
  accessToken: string,
  subreddit: string,
  limit: number,
  after?: string
): Promise<RedditListing> {
  const params = new URLSearchParams({
    raw_json: "1",
    limit: limit.toString()
  });

  if (after) {
    params.append("after", after);
  }

  const url = `https://oauth.reddit.com/r/${subreddit}/new.json?${params.toString()}`;

  await delay(DEFAULT_FETCH_DELAY);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": DEFAULT_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch posts: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as RedditListing;
  return data;
}

/**
 * Fetch comments for a specific post
 *
 * @param accessToken Access token retrieved by getAccessToken()
 * @param subreddit Name of subreddit (without any /r/ prefix)
 * @param postId Id of post to fetch comments for
 * @param config Configuration object with depth, limit, and sort options
 */
export async function fetchComments(
  accessToken: string,
  subreddit: string,
  postId: string,
  config: {
    depth?: number;
    limit?: number;
    sort?: string;
  } = {}
): Promise<[any, RedditCommentListing]> {
  const { depth, limit = 500, sort = "confidence" } = config;

  const params = new URLSearchParams({
    raw_json: "1",
    limit: limit.toString(),
    sort,
  });

  if (depth !== undefined) {
    params.append("depth", Math.min(Math.max(depth, 1), 10).toString());
  }

  const url = `https://oauth.reddit.com/r/${subreddit}/comments/${postId}.json?${params.toString()}`;

  await delay(DEFAULT_FETCH_DELAY);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": DEFAULT_USER_AGENT
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch comments for post ${postId}: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as [any, RedditCommentListing];
  return data;
}
