import "dotenv/config";
import { defineConfig } from "prisma/config";

// `generate` (run from postinstall on every deploy) doesn't need a resolvable
// database connection at all — only `migrate`/`db push`/actual queries do. Read
// process.env directly here instead of the strict `env()` helper so a missing
// DATABASE_URL at install time (e.g. before it's configured on a new deploy
// platform) doesn't fail the whole build.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
