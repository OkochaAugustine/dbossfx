"use client";

import { useState, useEffect } from "react";
import { Flex, Box, VStack, Text, Button, Spinner, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import StatTrading from "../components/stattrading";

export default function StartTradingPage() {
  const router = useRouter();

  const [account, setAccount] = useState({
    userId: null,
    balance: 0,
    earned_profit: 0,
    active_deposit: 0
  });

  const [loading, setLoading] = useState(true);
  const [showTradingBot, setShowTradingBot] = useState(false);

  const fetchAccount = async () => {
    try {

      console.log("🔵 Fetching /api/auth/me");

      const userRes = await fetch("/api/auth/me", {
        credentials: "include"
      });

      const userData = await userRes.json();

      console.log("🔵 userData:", userData);

      if (!userData?.success || !userData?.user) {
        console.warn("❌ No user returned");
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      console.log("🔵 userId:", userId);

      console.log("🔵 Fetching account for:", userId);

      const accRes = await fetch(`/api/account/${userId}`, {
        credentials: "include"
      });

      const accData = await accRes.json();

      console.log("🔵 account API response:", accData);

      const acc = accData.account;

      const balance = Number(acc?.balance || 0);

      console.log("🟢 Parsed balance:", balance);

      setAccount({
        userId,
        balance,
        earned_profit: Number(acc?.earned_profit || 0),
        active_deposit: Number(acc?.active_deposit || 0)
      });

      setLoading(false);

    } catch (err) {

      console.error("❌ Account fetch error:", err);

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchAccount();

    // refresh balance every 5 seconds
    const interval = setInterval(fetchAccount, 5000);

    return () => clearInterval(interval);

  }, []);

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="yellow.400" />
      </Flex>
    );
  }

  if (!account.userId) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Text>User not found</Text>
      </Flex>
    );
  }

  if (showTradingBot) {
    return (
      <Box w="100%">
        <StatTrading userId={account.userId} />
      </Box>
    );
  }

  console.log("🟢 Current account state:", account);

  return (
    <Flex h="100vh" w="100%" align="center" justify="center" bg="gray.50" p={6}>
      <VStack spacing={6} p={6} bg="white" rounded="2xl" shadow="2xl">

        {account.balance > 0 ? (
          <>
            <Heading color="green.500" size="lg">
              Ready to Trade!
            </Heading>

            <Text fontSize="md" color="gray.700" textAlign="center">
              Balance: ${account.balance.toFixed(2)}
            </Text>

            <Text fontSize="sm" color="gray.500">
              Earned Profit: ${account.earned_profit}
            </Text>

            <Text fontSize="sm" color="gray.500">
              Active Deposit: ${account.active_deposit}
            </Text>

            <Button
              colorScheme="green"
              onClick={() => setShowTradingBot(true)}
            >
              Start Trading
            </Button>
          </>
        ) : (
          <>
            <Heading color="red.500" size="lg">
              Account Empty
            </Heading>

            <Text fontSize="md" color="gray.700" textAlign="center">
              Your account is empty. Please fund your account to continue trading.
            </Text>

            <Button
              colorScheme="yellow"
              onClick={() => router.push("/dashboard/deposit")}
            >
              Fund Account
            </Button>
          </>
        )}

      </VStack>
    </Flex>
  );
}