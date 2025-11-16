import { fetchNewestPostsBatch as fetchNewRedditPostsBatch, fetchComments } from "./reddit-api.js";
import { getLogger } from "./logger.js";
import { readPost, savePost } from "./storage.js";
import type { RedditCommentListing, RedditComment, RedditMoreComments, RedditCommentData } from "./types-api.js";

export async function processBatch(
  subreddit: string,
  authToken: string,
  batchSize: number,
  after?: string,
  storageDirectory?: string): Promise<{ after: string | null; fetchedPostsCount: number; oldestDate: number; }> {
  const logger = getLogger();
  const postBatchResponse = await fetchNewRedditPostsBatch(
    authToken,
    subreddit,
    batchSize,
    after
  );

  function flattenComments(
    commentListing: RedditCommentListing
  ): Array<Omit<RedditCommentData, 'replies'>> {
    const comments: Omit<RedditCommentData, 'replies'>[] = [];

    function traverse(children: (RedditComment | RedditMoreComments)[]): void {
      for (const child of children) {
        if (child.kind === "more") {
          // Skip "more" comments objects
          logger.debug(`DEBUG: skipping "more" comments object. Would be ${child.data.count} more replies.`);
        } else if (child.kind === "t1") { // Only process actual comments (t1)
          const commentData = child.data;

          comments.push(commentData);

          // Recursively process replies
          if (child.data.replies &&
            typeof child.data.replies === "object" &&
            child.data.replies.data?.children) {
            traverse(child.data.replies.data.children);
          }

          // TODO add user option to include html
          // @ts-ignore clear html as it just eats up space
          delete commentData.body_html

          // @ts-ignore do not store replies
          delete commentData.replies
        } else {
          logger.debug(`DEBUG: unprocessable child when processing comments: ${JSON.stringify(child)}`);
        }
      }
    }

    if (commentListing.data?.children) {
      traverse(commentListing.data.children);
    }

    return comments;
  }
  const postsWithoutComments = postBatchResponse.data.children.map(({ data }) => (
    data
  ))

  for (const postWithoutComments of postsWithoutComments) {
    // TODO add user option to include html
    // @ts-ignore remove html attribute as it just eats memory
    delete postWithoutComments.selftext_html;

    const existingPostData = await readPost(postWithoutComments, storageDirectory);
    logger.debug(`Processing ${postWithoutComments.title.substring(0, 50)}...`);
    if (existingPostData)
      logger.debug("Found persisted comments data for post");
    if (
      // Note: you can't compare existingPostData.comments.length because not all comments are fetched
      // This is because reddit provides a "MoreComments" object that we don't process (because we only want relevant comments)
      existingPostData &&
      existingPostData.num_comments === postWithoutComments.num_comments) {
      logger.debug(
        "Skipping comment fetching because the number of comments hasn't changed since last fetch."
      );
    } else if (postWithoutComments.num_comments > 0) {
      logger.info(
        `Fetching ${postWithoutComments.num_comments} comments for ${postWithoutComments.title.substring(0, 50)}...`
      );
      const [_, result] = await fetchComments(
        authToken,
        subreddit,
        postWithoutComments.id
      );
      const comments = flattenComments(result);

      await savePost({ ...postWithoutComments, ...{ replies_flat: comments } }, storageDirectory);
    } else {
      await savePost({ ...postWithoutComments, ...{ replies_flat: [] } }, storageDirectory);
      logger.debug("skipping comments fetch - post has no comments");
    }
  }
  const oldestTimestamp = postBatchResponse.data.children.at(-1)?.data.created_utc ?? 0;

  return {
    after: postBatchResponse.data.after,
    fetchedPostsCount: postBatchResponse.data.children.length,
    oldestDate: oldestTimestamp,
  };
}

