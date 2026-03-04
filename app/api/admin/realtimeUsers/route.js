// app/api/admin/realtimeUsers/route.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";

// ✅ Create Supabase client with service role
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 🔥 Keep-alive ping every 15 seconds
      const keepAlive = setInterval(() => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ keepAlive: true })}\n\n`)
        );
      }, 15000);

      // 🔥 Subscribe to INSERT events on the users table
      const channel = supabase
        .channel("public:users")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "users" },
          async (payload) => {
            try {
              // Fetch linked account_statement for the new user
              const { data: account, error: accountError } = await supabase
                .from("account_statements")
                .select("*")
                .eq("user_id", payload.new.id)
                .single();

              if (accountError) {
                console.error("Account fetch error:", accountError);
              }

              // Send user + account info to dashboard
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ ...payload.new, account })}\n\n`
                )
              );
            } catch (err) {
              console.error("Realtime user error:", err);
            }
          }
        )
        .subscribe();

      // 🔥 Cleanup on client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        supabase.removeChannel(channel);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}