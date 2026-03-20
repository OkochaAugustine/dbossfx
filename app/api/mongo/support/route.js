import connectToMongo from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";

// ---------------- GET MESSAGES ----------------
export async function GET(req) {
  try {
    await connectToMongo();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const adminView = searchParams.get("admin");

    // ❌ Block visitors completely
    if (!userId && adminView !== "true") {
      return Response.json(
        { success: false, error: "Unauthorized request" },
        { status: 401 }
      );
    }

    let messages = [];

    // ✅ User fetching their own messages
    if (userId) {
      messages = await SupportMessage.find({ userId }).sort({ createdAt: 1 });
    }

    // ✅ Admin fetching all messages
    if (adminView === "true") {
      messages = await SupportMessage.find().sort({ createdAt: 1 });
    }

    return Response.json({ success: true, messages }, { status: 200 });

  } catch (error) {
    console.error("GET support error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// ---------------- SEND MESSAGE ----------------
export async function POST(req) {
  try {
    await connectToMongo();

    const body = await req.json();
    const { userId, sender, message } = body;

    // ❌ Prevent visitors from sending messages
    if (!userId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 401 }
      );
    }

    if (!sender || !message) {
      return Response.json(
        { success: false, error: "Missing sender or message" },
        { status: 400 }
      );
    }

    const newMessage = await SupportMessage.create({
      userId,
      sender,
      message,
      read: false,
    });

    return Response.json(
      { success: true, message: newMessage },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST support error:", error);
    return Response.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}