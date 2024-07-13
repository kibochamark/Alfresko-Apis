// import { Pool } from "pg";
// import { drizzle } from 'drizzle-orm/neon-http';
import { Pool } from '@neondatabase/serverless';

// import { drizzle } from 'drizzle-orm/neon-http';
// import { neon } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "../db/schema"


// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })
// import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: "postgresql://neondb_owner:30WYKdxVMhnQ@ep-rapid-snow-a26ly6wq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require" });
const db = drizzle(pool)

// const sql = neon("postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require");
// const db = drizzle(sql, {schema:schema});

// const db = drizzle(pool)

// import { Pool } from "pg";
// import { neon } from '@neondatabase/serverless';

// const sql = neon("postgresql://Alfresko_owner:rTJVEt3qGaH8@ep-wild-cherry-a5phky7j-pooler.us-east-2.aws.neon.tech/Alfresko?sslmode=require");


// // const pool = new Pool({
// //   connectionString: "postgres://postgres:kibo1215@127.0.0.1:5432/Configurator",
// // });

// // or
// // const pool = new Pool({
// //   host: "127.0.0.1",
// //   port: 5432,
// //   user: "postgres",
// //   password: "kibo1215",
// //   database: "Configurator",
// // });

// const db = drizzle(sql, {schema:schema});



export default db




