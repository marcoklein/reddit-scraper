/**
 * Extracted types from Reddit API results.
 */
export interface RedditListing {
  kind: string;
  data: {
    after: string | null;
    dist: number;
    modhash: string;
    geo_filter: string;
    children: RedditPost[];
    before: string | null;
  };
}

/**
 * Extracted types from Reddit API results.
 */
export interface RedditPost {
  kind: string;
  data: RedditPostData;
}

export interface RedditPostData {
  approved_at_utc: number | null;
  subreddit: string;
  selftext: string;
  author_fullname: string;
  saved: boolean;
  mod_reason_title: string | null;
  gilded: number;
  clicked: boolean;
  title: string;
  link_flair_richtext: Array<{
    e: string;
    t: string;
  }>;
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_class: string | null;
  downs: number;
  thumbnail_height: number | null;
  top_awarded_type: string | null;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: string;
  upvote_ratio: number;
  author_flair_background_color: string | null;
  subreddit_type: string;
  ups: number;
  total_awards_received: number;
  media_embed: Record<string, any>;
  thumbnail_width: number | null;
  author_flair_template_id: string | null;
  is_original_content: boolean;
  user_reports: any[];
  secure_media: any | null;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category: string | null;
  secure_media_embed: Record<string, any>;
  link_flair_text: string | null;
  can_mod_post: boolean;
  score: number;
  approved_by: string | null;
  is_created_from_ads_ui: boolean;
  author_premium: boolean;
  thumbnail: string;
  edited: boolean | number;
  author_flair_css_class: string | null;
  author_flair_richtext: any[];
  gildings: Record<string, any>;
  post_hint?: string;
  content_categories: string[] | null;
  is_self: boolean;
  mod_note: string | null;
  created: number;
  link_flair_type: string;
  wls: number;
  removed_by_category: string | null;
  banned_by: string | null;
  author_flair_type: string;
  domain: string;
  allow_live_comments: boolean;
  selftext_html: string | null;
  likes: boolean | null;
  suggested_sort: string;
  banned_at_utc: number | null;
  url_overridden_by_dest?: string;
  view_count: number | null;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  preview?: {
    enabled: boolean;
    images?: any[];
  };
  all_awardings: any[];
  awarders: any[];
  media_only: boolean;
  link_flair_template_id?: string;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: string | null;
  treatment_tags: any[];
  visited: boolean;
  removed_by: string | null;
  num_reports: number | null;
  distinguished: string | null;
  subreddit_id: string;
  author_is_blocked: boolean;
  mod_reason_by: string | null;
  removal_reason: string | null;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  report_reasons: any | null;
  author: string;
  discussion_type: string | null;
  num_comments: number;
  send_replies: boolean;
  contest_mode: boolean;
  mod_reports: any[];
  author_patreon_flair: boolean;
  author_flair_text_color: string | null;
  permalink: string;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  num_crossposts: number;
  media: any | null;
  is_video: boolean;
  // [key: string]: any; // For additional properties we don't explicitly need
}

/**
 * Extracted types from Reddit API results.
 */
export interface RedditCommentListing {
  kind: string;
  data: {
    children: (RedditComment | RedditMoreComments)[];
    after: string | null;
    before: string | null;
  };
}

/**
 * Extracted types from Reddit API results.
 */
export interface RedditComment {
  kind: "t1";
  data: RedditCommentData;
}

export interface RedditCommentData {
  id: string;
  name: string;
  author: string;
  author_fullname: string;
  body: string;
  body_html: string;
  created: number;
  created_utc: number;
  score: number;
  ups: number;
  downs: number;
  parent_id: string;
  depth: number;
  edited: boolean | number;
  gilded: number;
  distinguished: string | null;
  stickied: boolean;
  score_hidden: boolean;
  permalink: string;
  replies: RedditCommentListing | "";
  // [key: string]: any; // For additional properties we don't explicitly need
}

/**
 * Extracted types from Reddit API results.
 */
export interface RedditMoreComments {
  kind: "more";
  data: {
    count: number;
    children: string[];
    id: string;
    name: string;
    parent_id: string;
    depth: number;
  };
}
