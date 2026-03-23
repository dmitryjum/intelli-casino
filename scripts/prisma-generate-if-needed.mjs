import { spawnSync } from "node:child_process";
import nextEnv from "@next/env";

// Postinstall can run before the main build script, so it needs the same
// empty-DATABASE_URL fallback. This keeps prisma generate from failing during
// installs when the app is intentionally deployed without a live database.
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const placeholderDatabaseUrl =
  "postgresql://placeholder:placeholder@127.0.0.1:5432/intelli_casino";

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL?.trim() || placeholderDatabaseUrl,
};

if (!process.env.DATABASE_URL?.trim()) {
  console.warn(
    "DATABASE_URL is not configured. Generating Prisma client with a placeholder URL."
  );
}

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
