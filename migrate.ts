import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// for migrations
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
try {
  await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
} catch (error) {
  console.log("Migration error:", error);
} finally {
  process.exit(0);
}
console.log("migration complete");
