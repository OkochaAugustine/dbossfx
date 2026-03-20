import connectToMongo from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";

export async function GET(req) {
  await connectToMongo();

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // camelCase
    if (!userId)
      return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });

    const messages = await SupportMessage.find({ userId }).sort({ createdAt: 1 }); // query by userId
    return new Response(JSON.stringify({ success: true, messages }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
  }
}

export async function POST(req) {
  await connectToMongo();

  try {
    const { userId, sender, message } = await req.json();
    if (!userId || !sender || !message)
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

    const newMessage = await SupportMessage.create({ userId, sender, message }); // save as userId
    return new Response(JSON.stringify({ success: true, message: newMessage }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
  }
}