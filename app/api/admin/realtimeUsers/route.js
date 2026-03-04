export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const keepAlive = setInterval(() => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ keepAlive: true })}\n\n`)
        );
      }, 15000);

      const channel = supabase
        .channel("public:users")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "users" },
          async (payload) => {
            try {
              let { data: account } = await supabase
                .from("account_statements")
                .select("*")
                .eq("user_id", payload.new.id)
                .maybeSingle();

              if (!account) {
                const { data: newAccount } = await supabase
                  .from("account_statements")
                  .insert({
                    user_id: payload.new.id,
                    balance: 0,
                    earned_profit: 0,
                    active_deposit: 0,
                    created_at: new Date().toISOString(),
                  })
                  .select()
                  .single();
                account = newAccount;
              }

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ ...payload.new, account })}\n\n`)
              );
            } catch (err) {
              console.error("Realtime user error:", err);
            }
          }
        )
        .subscribe();

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