import fs from "fs/promises";
import path from "path";
import type { Post } from "./types.js";
import { getLogger } from "./logger.js";

/**
 * Persists a Reddit post.
 *
 * @param post Post to persist.
 */
export async function savePost(post: Post) {
  const logger = getLogger();
  const filePath =
    `./results/${post.subreddit}/${post.created_utc}-${post.id}.json`;
  logger.debug(`Saving post ${post.id} to ${filePath}`)

  // Ensure directory exists
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(filePath,
    JSON.stringify(post, null, 2),
    "utf-8"
  );
}

/**
 * Reads a persisted post.
 *
 * @param postId Subset of a Post to identify the write location.
 * @returns
 */
export async function readPost(postId: {
  subreddit: string;
  created_utc: number;
  id: string;
}): Promise<Post | undefined> {
  const logger = getLogger();
  const filePath = `./results/${postId.subreddit}/${postId.created_utc}-${postId.id}.json`
  logger.debug(`Reading post from ${filePath}`)
  
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

