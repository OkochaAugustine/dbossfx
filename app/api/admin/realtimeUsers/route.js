export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";
import AccountStatement from "@/models/AccountStatement";

export async function GET(req) {
  const encoder = new TextEncoder();

  let lastCheck = new Date(); // track new users

  const stream = new ReadableStream({
    async start(controller) {
      await connectToMongo();

      // Keep connection alive (important for SSE)
      const keepAlive = setInterval(() => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ keepAlive: true })}\n\n`)
        );
      }, 15000);

      // Poll for new users every 5 seconds
      const interval = setInterval(async () => {
        try {
          const newUsers = await User.find({
            createdAt: { $gt: lastCheck },
          }).lean();

          if (newUsers.length > 0) {
            lastCheck = new Date();

            for (const user of newUsers) {
              let account = await AccountStatement.findOne({
                user_id: user._id.toString(),
              }).lean();

              // Create account if missing
              if (!account) {
                account = await AccountStatement.create({
                  user_id: user._id.toString(),
                  balance: 0,
                  earned_profit: 0,
                  active_deposit: 0,
                });
              }

              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    user_id: user._id.toString(),
                    full_name: user.full_name || "No Name",
                    email: user.email,
                    phone: user.phone || "",
                    account,
                    created_at: user.createdAt,
                  })}\n\n`
                )
              );
            }
          }
        } catch (err) {
          console.error("Realtime Mongo error:", err);
        }
      }, 5000);

      // Cleanup on disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        clearInterval(interval);
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