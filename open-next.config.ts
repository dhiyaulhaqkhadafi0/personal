import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const cloudflareConfig = defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});

export default {
  ...cloudflareConfig,
  // Cloudflare Workers Builds invokes `npm run build`. OpenNext then needs a
  // separate command for compiling Next.js itself, otherwise it recurses.
  buildCommand: "npm run build:next",
};
