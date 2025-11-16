# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.4.0

- Configurable storage location via `--output`/`-o` CLI flag
- `STORAGE_PATH` environment variable to set default storage directory
- Storage location configuration now follows priority: CLI flag > environment variable > default (`./results`)

## 0.3.0

- Rename post `comments` to `replies_flat` to stick with `replies` naming of API
- Omit `replies` on nested replies
- Delete mapping of subreddit name
- Delete `selftext_html` and `body_html` to avoid unnecessary HTML in results

## 0.2.1

- Fix early stopping

## 0.2.0

- Support for multiple subreddit scraping via `--subreddits` option
- Both `--subreddit` and `--subreddits` flags accept comma-separated lists of subreddits

## 0.1.1

- `package.json` repo url

## 0.1.0

- Initial release with single subreddit scraping support
