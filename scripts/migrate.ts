import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL!);

async function main() {
  try {
    console.log("Adding phone_number column to user table...");
    await client`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone_number" text;`;
    console.log("Column added successfully!");
  } catch (error) {
    console.error("Error altering table:", error);
  } finally {
    await client.end();
  }
}

main();
