"use client";

import { useState, useEffect } from "react";
import { Flex, VStack, Text, Heading, Button, Box, Progress } from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"; // ✅ Use router for navigation
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function StartTrading({ userId }) {
  const router = useRouter();
  const [profit, setProfit] = useState(0);
  const [displayedProfit, setDisplayedProfit] = useState(0);
  const [trading, setTrading] = useState(false);
  const [account, setAccount] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [tradesLeft, setTradesLeft] = useState(20);

  const MAX_TRADES_PER_DAY = 20;
  const TARGET_DAILY_PROFIT = 200;

  // Reset daily profit and trades every 24 hours
  useEffect(() => {
    const lastReset = localStorage.getItem(`lastReset_${userId}`);
    const now = new Date().getTime();

    if (!lastReset || now - lastReset >= 24 * 60 * 60 * 1000) {
      setDailyProfit(0);
      setLimitReached(false);
      setTradesLeft(MAX_TRADES_PER_DAY);
      localStorage.setItem(`lastReset_${userId}`, now);
    } else {
      const storedProfit = Number(localStorage.getItem(`dailyProfit_${userId}`)) || 0;
      const storedTrades = Number(localStorage.getItem(`tradesLeft_${userId}`)) || MAX_TRADES_PER_DAY;
      setDailyProfit(storedProfit);
      setTradesLeft(storedTrades);
      if (storedProfit >= TARGET_DAILY_PROFIT || storedTrades <= 0) setLimitReached(true);
    }
  }, [userId]);

  // Fetch account balance
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    const fetchAccount = async () => {
      const { data, error } = await supabase
        .from("account_statements")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (!isMounted) return;
      if (error || !data) setAccount({ balance: 0 });
      else setAccount(data);
      setLoading(false);
    };
    fetchAccount();
    return () => { isMounted = false; };
  }, [userId]);

  const calculateTradeAmount = () => {
    if (account.balance <= 0) return 0;
    return TARGET_DAILY_PROFIT / (MAX_TRADES_PER_DAY * 0.05);
  };

  const startTrade = () => {
    if (limitReached) return alert("Stop! Limit exceeded, come again in 24 hours");
    if (account.balance <= 0) return alert("Account balance is zero. Fund account first!");
    if (tradesLeft <= 0) {
      setLimitReached(true);
      return alert("Stop! Limit exceeded, come again in 24 hours");
    }

    setTrading(true);
    setDisplayedProfit(0);

    const remainingProfit = TARGET_DAILY_PROFIT - dailyProfit;
    const tradeAmount = calculateTradeAmount();
    const calculatedProfit = Math.min(tradeAmount * 0.05, remainingProfit);
    setProfit(calculatedProfit);
  };

  // Animate profit
  useEffect(() => {
    if (!trading || profit === 0) return;

    let current = 0;
    const step = profit / 200;
    const interval = setInterval(() => {
      current += step;
      if (current >= profit) {
        current = profit;
        clearInterval(interval);
        updateAccountProfit(profit);
        const newDailyProfit = dailyProfit + profit;
        const newTradesLeft = tradesLeft - 1;
        setDailyProfit(newDailyProfit);
        setTradesLeft(newTradesLeft);
        localStorage.setItem(`dailyProfit_${userId}`, newDailyProfit);
        localStorage.setItem(`tradesLeft_${userId}`, newTradesLeft);

        if (newDailyProfit >= TARGET_DAILY_PROFIT || newTradesLeft <= 0) {
          setLimitReached(true);
        }

        setTrading(false);
      }
      setDisplayedProfit(current);
    }, 50);
    return () => clearInterval(interval);
  }, [trading, profit]);

  const updateAccountProfit = async (profitEarned) => {
    try {
      await supabase
        .from("account_statements")
        .update({ balance: account.balance + profitEarned })
        .eq("user_id", userId);
      setAccount((prev) => ({ ...prev, balance: prev.balance + profitEarned }));
    } catch (err) {
      console.error("Failed to update account:", err);
    }
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Text>Loading account...</Text>
      </Flex>
    );
  }

  return (
    <Flex
      h="100vh"
      w="100vw"
      align="center"
      justify="center"
      bgImage="url('/images/start-bg.jpg')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      p={6}
    >
      <VStack spacing={6} p={8} bg="whiteAlpha.900" rounded="3xl" shadow="2xl" maxW="3xl" align="center">
        {/* ✅ Back to Dashboard button */}
        <Button
          leftIcon={<ArrowBackIcon />}
          alignSelf="start"
          variant="ghost"
          colorScheme="yellow"
          onClick={() => router.replace("/dashboard")} // ✅ Updated
        >
          Back to Dashboard
        </Button>

        <Heading size="2xl" color="yellow.400" textShadow="2px 2px black">
          Trading Bot
        </Heading>

        <Text fontSize="lg" color="gray.800" textAlign="center">
          AI-powered bot executes high-probability trades across Forex, Crypto, and Stocks. Daily target profit: ${TARGET_DAILY_PROFIT}.
        </Text>

        <Text fontSize="md" color="gray.700" textAlign="center">
          Account Balance: ${account.balance.toFixed(2)}
        </Text>

        <Button
          colorScheme="green"
          size="lg"
          px={12}
          py={6}
          fontSize="xl"
          isDisabled={trading || account.balance <= 0 || limitReached}
          onClick={startTrade}
        >
          {trading ? "Trading..." : limitReached ? "Limit Reached" : "Start Trading"}
        </Button>

        {trading && (
          <Box w="100%" mt={4}>
            <Text>Profit: ${displayedProfit.toFixed(2)}</Text>
            <Progress value={(displayedProfit / profit) * 100} size="lg" colorScheme="yellow" />
            <Text mt={2} fontSize="sm" color="gray.600">
              Trades left today: {tradesLeft} | Daily profit: ${dailyProfit.toFixed(2)}/${TARGET_DAILY_PROFIT}
            </Text>
          </Box>
        )}

        {limitReached && (
          <Text mt={4} fontSize="lg" color="red.500" fontWeight="bold">
            Stop! Limit exceeded, come again in 24 hours
          </Text>
        )}
      </VStack>
    </Flex>
  );
}
