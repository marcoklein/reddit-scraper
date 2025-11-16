import type { RedditCommentData, RedditPostData } from "./types-api.js";

export interface Post extends RedditPostData {
  /**
   * Flattened replies section.
   */
  replies_flat: Omit<RedditCommentData, 'replies'>[] | []
}
