export const runtime = "edge"; // ✅ Important for Vercel Edge

export const GET = async () => {
  const token = process.env.NEXT_PUBLIC_OANDA_TOKEN;
  const accountId = process.env.NEXT_PUBLIC_OANDA_ACCOUNT;
  const instruments = ["EUR_USD","GBP_USD","USD_JPY","AUD_USD","USD_CHF"].join(",");

  const url = `https://stream-fxpractice.oanda.com/v3/accounts/${accountId}/pricing/stream?instruments=${instruments}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch stream" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert streaming data to SSE compatible response
    const reader = res.body.getReader();
    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
