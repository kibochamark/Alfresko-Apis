import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://Alfresko_owner:rTJVEt3qGaH8@ep-wild-cherry-a5phky7j-pooler.us-east-2.aws.neon.tech/Alfresko?sslmode=require",
  },
});
