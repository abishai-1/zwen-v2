import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };

/** Returns a Drizzle client, or null when DATABASE_URL isn't configured. */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  // Reuse one pool across hot reloads / warm serverless invocations.
  globalForDb.pg ??= postgres(url, { max: 1, prepare: false });
  return drizzle(globalForDb.pg, { schema });
}
