import { defineConfig } from "drizzle-kit";

import config from "@/lib/config";

export default defineConfig({
  schema: "./src/lib/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: config.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
