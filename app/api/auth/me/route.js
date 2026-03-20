// /api/auth/me
import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get("userId");
    const userId = userCookie?.value;

    if (!userId) {
      return Response.json({ success: false, user: null });
    }

    await connectToMongo();
    const user = await User.findById(userId).select("-password");

    if (!user) {
      cookieStore.delete("userId");
      return Response.json({ success: false, user: null });
    }

    // ✅ Always return user data if logged in, include verification status
    return Response.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role || "user",
        is_verified: user.is_verified,
      },
    });

  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}