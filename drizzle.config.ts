import type { Config } from "drizzle-kit";
import 'dotenv/config'

export default {
  schema: "./src/lib/schema.ts",
  driver: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  }
} satisfies Config;