import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../../shared/schema.js";

const { Pool } = pg;

// Use a placeholder URL if DATABASE_URL is missing to prevent startup crashes.
// Database operations will fail at runtime if the connection is actually attempted.
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/placeholder";

if (!process.env.DATABASE_URL) {
  console.warn("\x1b[33m%s\x1b[0m", "WARNING: DATABASE_URL is not set. Database operations will fail if called.");
}

export const pool = new Pool({ 
  connectionString,
  // Ensure we don't crash on connection errors during initialization
  connectionTimeoutMillis: 5000 
});

export const db = drizzle(pool, { schema });
