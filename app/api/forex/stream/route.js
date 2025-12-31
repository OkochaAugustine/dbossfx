// import fetch from "node-fetch";

// export const GET = async () => {
//   const token = process.env.OANDA_TOKEN;
//   const accountId = process.env.OANDA_ACCOUNT;
//   const instruments = ["EUR_USD","GBP_USD","USD_JPY","AUD_USD","USD_CHF"].join(",");

//   const url = `https://stream-fxpractice.oanda.com/v3/accounts/${accountId}/pricing/stream?instruments=${instruments}`;

//   return new Response(
//     new ReadableStream({
//       async start(controller) {
//         const res = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const reader = res.body.getReader();
//         const decoder = new TextDecoder();

//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           const chunk = decoder.decode(value);
//           controller.enqueue(new TextEncoder().encode(`data: ${chunk}\n\n`));
//         }
//         controller.close();
//       },
//     }),
//     {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         Connection: "keep-alive",
//       },
//     }
//   );
// };
