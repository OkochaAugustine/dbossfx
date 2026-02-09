"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGate() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // ✅ Store token in localStorage (or memory)
        localStorage.setItem("admin_token", data.token);

        router.replace("/admin");
      } else {
        setError(data.error || "Invalid code");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm p-6 bg-gray-800 rounded shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Access</h1>

        <input
          type="password"
          maxLength={8}
          placeholder="Enter 8-digit admin code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Enter Admin Panel"}
        </button>
      </div>
    </div>
  );
}
