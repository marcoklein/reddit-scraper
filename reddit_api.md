# Reddit API Documentation

This document describes the Reddit API endpoints used in this project. See https://www.reddit.com/dev/api#GET_new for further information.

## Authentication

### POST /api/v1/access_token

Obtain an OAuth2 access token for API authentication.

**Authentication Method:** HTTP Basic Auth (Client ID:Secret)

**Headers:**

- `Authorization`: Basic authentication with base64 encoded `client_id:secret`
- `Content-Type`: `application/x-www-form-urlencoded`
- `User-Agent`: Custom user agent (e.g., `RedditScraperBot/0.1 by reddit-scraper`)

**Request Body (URL-encoded):**

- `grant_type`: `client_credentials`

**Response:**

```json
{
  "access_token": "string",
  "token_type": "bearer",
  "expires_in": 3600,
  "scope": "string"
}
```

**Usage in this project:**
Used to obtain an access token that is then used for subsequent API calls to access Reddit data.

---

## Listings

### GET [/r/subreddit]/new

Get new posts from a subreddit sorted by creation time (newest first).

**Reference:** https://www.reddit.com/dev/api#GET_new

**Authentication:** Requires OAuth2 Bearer token

**Headers:**

- `Authorization`: `Bearer {access_token}`
- `User-Agent`: Custom user agent (e.g., `RedditScraperBot/0.1 by reddit-scraper`)

**Query Parameters:**

- `raw_json` (optional): Set to `1` to prevent HTML encoding of special characters (`<`, `>`, `&`). Without this, these characters are replaced with HTML entities (`&lt;`, `&gt;`, `&amp;`).
- `limit` (optional): Maximum number of items to return (default: 25, maximum: 100)
- `show` (optional): If set to `all`, disables filters like "hide links that I have voted on"
- `after` (optional): Fullname of a thing to use as the anchor point for pagination (only one of `after`/`before` should be specified)
- `before` (optional): Fullname of a thing to use as the anchor point for pagination
- `count` (optional): Number of items already seen in the listing (used for pagination, default: 0)

**Response:**

Returns a listing object containing post data. The response structure:

```json
{
  "kind": "Listing",
  "data": {
    "after": "fullname_of_next_item",
    "before": null,
    "children": [
      {
        "kind": "t3",
        "data": {
          "title": "Post title",
          "selftext": "Post body text",
          "author": "username",
          "author_fullname": "t2_xxxxx",
          "ups": 123,
          "score": 120,
          "downs": 3,
          "upvote_ratio": 0.95,
          "num_comments": 45,
          "created": 1234567890,
          "url": "https://...",
          "is_video": false,
          "media": null
        }
      }
    ]
  }
}
```

**Key Properties Used in This Project:**

From the post data object:

- `title`: The title of the submission
- `selftext`: The body text of a self-post (empty for link posts)
- `author`: Username of the post author
- `author_fullname`: Fullname identifier of the author (format: `t2_xxxxx`)
- `ups`: Number of upvotes
- `score`: The net score (upvotes - downvotes)
- `downs`: Number of downvotes
- `upvote_ratio`: Ratio of upvotes to total votes (0.0 to 1.0)
- `num_comments`: Number of comments on the post
- `created`: Unix timestamp of post creation time
- `url`: The URL the post links to
- `is_video`: Boolean indicating if the post contains video
- `media`: Media object if the post contains embedded media

**Pagination:**

To retrieve more posts, use the `after` value from the response as the `after` parameter in the next request. The `count` parameter should be incremented by the number of items received.

**Usage in this project:**
Currently configured to fetch 1 new post from r/improv for testing purposes. Can be adjusted by modifying the `limit` parameter.

---

## Comments

### GET [/r/subreddit]/comments/article

Get comments for a specific post (article).

**Reference:** https://www.reddit.com/dev/api#GET_comments_{article}

**Authentication:** Requires OAuth2 Bearer token

**Headers:**

- `Authorization`: `Bearer {access_token}`
- `User-Agent`: Custom user agent (e.g., `RedditScraperBot/0.1 by reddit-scraper`)

**Path Parameters:**

- `article`: The ID36 of the post (without the `t3_` prefix)

**Query Parameters:**

- `raw_json` (optional): Set to `1` to prevent HTML encoding of special characters
- `depth` (optional): Maximum depth of comment subtrees to return (default: no limit, max: 10)
- `limit` (optional): Maximum number of comments to return (default: 100, max: 500)
- `sort` (optional): Sort order for comments - `confidence` (default), `top`, `new`, `controversial`, `old`, `qa`
- `showmore` (optional): Boolean to show "MoreComments" objects (default: true)
- `comment` (optional): ID36 of a comment to focus on (returns only that comment and its ancestors/children)
- `context` (optional): Number of parent comments to include when using `comment` parameter (default: 0)

**Response:**

Returns a 2-element array:
1. First element: Listing containing the post itself
2. Second element: Listing containing top-level comments and their replies

```json
[
  {
    "kind": "Listing",
    "data": {
      "children": [{
        "kind": "t3",
        "data": { /* post data */ }
      }]
    }
  },
  {
    "kind": "Listing",
    "data": {
      "children": [{
        "kind": "t1",
        "data": {
          "id": "comment_id",
          "author": "username",
          "body": "Comment text",
          "body_html": "HTML-encoded comment text",
          "created": 1234567890,
          "created_utc": 1234567890,
          "score": 42,
          "ups": 45,
          "downs": 3,
          "parent_id": "t3_postid",
          "depth": 0,
          "replies": {
            "kind": "Listing",
            "data": {
              "children": [ /* nested comment objects */ ]
            }
          }
        }
      },
      {
        "kind": "more",
        "data": {
          "count": 10,
          "children": ["comment_id_1", "comment_id_2"],
          "id": "more_id"
        }
      }]
    }
  }
]
```

**Key Properties Used in This Project:**

From the comment data object:

- `id`: The unique identifier for the comment
- `author`: Username of the comment author
- `body`: The raw comment text
- `created`: Unix timestamp of comment creation time
- `created_utc`: Unix timestamp of comment creation time (UTC)
- `score`: The net score of the comment (upvotes - downvotes)
- `parent_id`: Fullname of the parent (either the post `t3_xxxxx` or another comment `t1_xxxxx`)
- `depth`: The nesting level of the comment (0 = top-level)
- `replies`: Nested listing object containing child comments (or empty string if no replies)

**Comment Structure:**

- Comments are organized in a tree structure using the `replies` property
- Each comment can have nested replies, which are themselves comment objects
- Top-level comments have `parent_id` pointing to the post (format: `t3_xxxxx`)
- Reply comments have `parent_id` pointing to the parent comment (format: `t1_xxxxx`)
- "MoreComments" objects (kind: `more`) represent collapsed comment threads that require additional API calls to fetch

**Usage in this project:**

Used to fetch all visible comments for scraped posts. Comments are flattened into a simple array structure with `parent_id` references for easier processing.

---

## Notes

### OAuth Scopes

The endpoints used in this project require the `read` OAuth scope at minimum.

### Rate Limiting

Reddit API has rate limits. Authenticated requests have higher rate limits than unauthenticated ones. Always include a descriptive User-Agent header.

### Best Practices

1. Always use `raw_json=1` to avoid HTML entity encoding
2. Use pagination (`after`/`before`) for large result sets
3. Respect rate limits and implement appropriate backoff strategies
4. Include a unique, descriptive User-Agent string identifying your application
