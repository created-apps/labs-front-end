import { defineCliConfig } from "sanity/cli";

// Let `npx sanity …` commands read the same .env.local as the website.
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  studioHost: undefined,
});
