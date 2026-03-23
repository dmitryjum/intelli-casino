import { spawnSync } from "node:child_process";
import nextEnv from "@next/env";

// Allow Vercel builds to succeed while the production DB is paused.
// When DATABASE_URL is present, run the normal Prisma migrate/generate flow.
// When it is missing or empty, skip migrations and use a placeholder URL so
// Prisma can still generate the client for the landing-page-only deployment.
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const placeholderDatabaseUrl =
  "postgresql://placeholder:placeholder@127.0.0.1:5432/intelli_casino";

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
const env = {
  ...process.env,
  DATABASE_URL: hasDatabaseUrl
    ? process.env.DATABASE_URL
    : placeholderDatabaseUrl,
};

if (hasDatabaseUrl) {
  run("npx", ["prisma", "migrate", "deploy"], env);
} else {
  console.warn(
    "DATABASE_URL is not configured. Skipping Prisma migrations and building landing page only."
  );
}

run("npx", ["prisma", "generate"], env);
run("next", ["build"], env);
