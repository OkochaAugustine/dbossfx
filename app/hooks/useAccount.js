"use client";

import { useEffect, useState } from "react";

export function useAccount() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔵 useAccount hook running");

    const fetchAccount = async () => {
      try {

        console.log("STEP 1 → Fetch /api/auth/me");

        const userRes = await fetch("/api/auth/me", {
          credentials: "include"
        });

        const userData = await userRes.json();

        console.log("STEP 2 → userData:", userData);

        if (!userData?.success || !userData?.user) {
          console.warn("❌ No user returned");
          setLoading(false);
          return;
        }

        const userId = userData.user.id || userData.user._id;

        console.log("STEP 3 → userId:", userId);

        console.log("STEP 4 → Fetch /api/account/" + userId);

        const accountRes = await fetch(`/api/account/${userId}`, {
          credentials: "include"
        });

        const accountData = await accountRes.json();

        console.log("STEP 5 → accountData:", accountData);

        // 🔴 IMPORTANT FIX
        const acc = accountData.account || accountData;

        const balance = Number(acc?.balance || 0);

        console.log("STEP 6 → Parsed balance:", balance);

        setAccount({
          userId,
          balance,
          earned_profit: Number(acc?.earned_profit || 0),
          active_deposit: Number(acc?.active_deposit || 0),
        });

      } catch (err) {

        console.error("❌ Account fetch error:", err);

        setAccount({
          userId: null,
          balance: 0
        });

      } finally {

        setLoading(false);

      }
    };

    fetchAccount();

  }, []);

  console.log("🟢 Current account state:", account);

  return { account, loading };
}