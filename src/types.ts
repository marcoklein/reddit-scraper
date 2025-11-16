import type { RedditCommentData, RedditPostData } from "./types-api.js";

export interface Comment extends RedditCommentData {
}

export interface Post extends RedditPostData {
  /**
   * Subreddit this post is in.
   */
  subreddit: string;

  /**
   * Comment tree.
   */
  comments: Comment[];
}
