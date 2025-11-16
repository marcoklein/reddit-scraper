import { loadEnv } from "./load-env.js";
loadEnv();

import { scrapeSubreddit } from "./scrape.js";


// TODO this is still an example call and the functions have to be exported
await scrapeSubreddit({ subreddit: 'improv', maxPostCount: 2 })
