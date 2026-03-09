// testFetch.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // load your .env.local

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      full_name,
      email,
      phone,
      account_statements (
        id,
        balance,
        earned_profit,
        active_deposit
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Error fetching users:", error);
  } else {
    console.log("✅ Users fetched:", data.length);
    console.log(data);
  }
}

test();