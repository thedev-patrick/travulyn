import "dotenv/config";
import { defineConfig } from "prisma/config";

// `generate` (run from postinstall on every deploy) doesn't need a resolvable
// database connection at all — only `migrate`/`db push`/actual queries do. Read
// process.env directly here instead of the strict `env()` helper so a missing
// DATABASE_URL at install time (e.g. before it's configured on a new deploy
// platform) doesn't fail the whole build.
//
// Migrations use DIRECT_URL when set. Pooled connection strings (PgBouncer in
// transaction mode, e.g. Neon's default) don't support the session-level
// advisory locks Prisma's migration engine takes, so providers like Neon
// require the unpooled connection string for `migrate`/`db push` even though
// the app itself should keep using the pooled DATABASE_URL at runtime
// (see lib/prisma.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
