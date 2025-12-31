import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key required for admin-level access
);

export async function GET() {
  try {
    // 1️⃣ Fetch all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("full_name", { ascending: true });

    if (usersError) throw usersError;

    // 2️⃣ Fetch all account statements
    const { data: accounts, error: accountsError } = await supabase
      .from("account_statements")
      .select("*");

    if (accountsError) throw accountsError;

    // 3️⃣ Merge users with their account statements
    const merged = await Promise.all(
      users.map(async (u) => {
        let acc = accounts.find(a => a.user_id === u.id);

        // 4️⃣ If no account exists, create it immediately
        if (!acc) {
          const { data: newAcc, error: createError } = await supabase
            .from("account_statements")
            .insert({
              user_id: u.id,
              balance: 0,
              earned_profit: 0,
              active_deposit: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) console.error("❌ Error creating account for user:", u.id, createError.message);
          acc = newAcc;
        }

        return {
          account_id: acc?.id,
          user_id: u.id,
          full_name: u.full_name,
          email: u.email,
          phone: u.phone,
          balance: acc.balance,
          earned_profit: acc.earned_profit,
          active_deposit: acc.active_deposit,
          equity: (acc.balance || 0) + (acc.earned_profit || 0) // 💹 include equity for admin display
        };
      })
    );

    // 5️⃣ Return merged data
    return new Response(JSON.stringify(merged), { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching accounts:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
