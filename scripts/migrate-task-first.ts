import "dotenv/config";

import { Client } from "pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const client = new Client({
    connectionString,
  });

  await client.connect();

  try {
    await client.query(`
      ALTER TABLE "Task"
      ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3)
    `);

    await client.query(`
      UPDATE "Task"
      SET "status" = 'BLOCKED'
      WHERE "status" = 'WAITING_MATERIAL'
    `);

    await client.query(`
      UPDATE "Task"
      SET "completedAt" = COALESCE("completedAt", "updatedAt")
      WHERE "status" = 'DONE'
    `);

    await client.query(`
      UPDATE "Task"
      SET "completedAt" = NULL
      WHERE "status" <> 'DONE'
    `);

    console.log("Task-first migration prep completed.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
