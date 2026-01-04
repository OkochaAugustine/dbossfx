"use client";

import { useState, useEffect } from "react";
import {
  Flex,
  VStack,
  Text,
  Heading,
  Button,
  Box,
  Progress,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function StartTrading({ userId }) {
  const router = useRouter();

  const MAX_TRADES_PER_DAY = 20;
  const TARGET_DAILY_PROFIT = 200;
  const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours (ms)

  const [profit, setProfit] = useState(0);
  const [displayedProfit, setDisplayedProfit] = useState(0);
  const [trading, setTrading] = useState(false);
  const [account, setAccount] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [tradesLeft, setTradesLeft] = useState(MAX_TRADES_PER_DAY);
  const [limitReached, setLimitReached] = useState(false);

  /* =======================
     ✅ 24-HOUR RESET LOGIC
  ======================== */
  useEffect(() => {
    if (!userId) return;

    const now = Date.now();
    const lastResetKey = `lastReset_${userId}`;
    const profitKey = `dailyProfit_${userId}`;
    const tradesKey = `tradesLeft_${userId}`;

    const lastReset = Number(localStorage.getItem(lastResetKey)) || 0;
    const diff = now - lastReset;

    if (!lastReset || diff >= RESET_INTERVAL) {
      // ✅ FULL RESET
      setDailyProfit(0);
      setTradesLeft(MAX_TRADES_PER_DAY);
      setLimitReached(false);

      localStorage.setItem(lastResetKey, String(now));
      localStorage.setItem(profitKey, "0");
      localStorage.setItem(tradesKey, String(MAX_TRADES_PER_DAY));
    } else {
      const storedProfit = Number(localStorage.getItem(profitKey)) || 0;
      const storedTrades = Number(localStorage.getItem(tradesKey)) || MAX_TRADES_PER_DAY;

      setDailyProfit(storedProfit);
      setTradesLeft(storedTrades);

      if (storedProfit >= TARGET_DAILY_PROFIT || storedTrades <= 0) {
        setLimitReached(true);
      }
    }
  }, [userId]);

  /* =======================
     FETCH ACCOUNT BALANCE
  ======================== */
  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    const fetchAccount = async () => {
      const { data } = await supabase
        .from("account_statements")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!mounted) return;

      setAccount(data || { balance: 0 });
      setLoading(false);
    };

    fetchAccount();
    return () => (mounted = false);
  }, [userId]);

  const calculateTradeAmount = () =>
    TARGET_DAILY_PROFIT / MAX_TRADES_PER_DAY;

  /* =======================
     START TRADE
  ======================== */
  const startTrade = () => {
    if (limitReached) {
      alert("Stop! Limit exceeded, come again in 24 hours");
      return;
    }

    if (account.balance <= 0) {
      alert("Account balance is zero. Fund account first!");
      return;
    }

    setTrading(true);
    setDisplayedProfit(0);

    const remainingProfit = TARGET_DAILY_PROFIT - dailyProfit;
    const profitEarned = Math.min(calculateTradeAmount() * 0.05, remainingProfit);

    setProfit(profitEarned);
  };

  /* =======================
     PROFIT ANIMATION
  ======================== */
  useEffect(() => {
    if (!trading || profit <= 0) return;

    let current = 0;
    const step = profit / 150;

    const interval = setInterval(async () => {
      current += step;

      if (current >= profit) {
        clearInterval(interval);
        current = profit;

        const newProfit = dailyProfit + profit;
        const newTradesLeft = tradesLeft - 1;

        setDailyProfit(newProfit);
        setTradesLeft(newTradesLeft);

        localStorage.setItem(`dailyProfit_${userId}`, String(newProfit));
        localStorage.setItem(`tradesLeft_${userId}`, String(newTradesLeft));

        if (newProfit >= TARGET_DAILY_PROFIT || newTradesLeft <= 0) {
          setLimitReached(true);
          localStorage.setItem(`lastReset_${userId}`, String(Date.now()));
        }

        await supabase
          .from("account_statements")
          .update({ balance: account.balance + profit })
          .eq("user_id", userId);

        setAccount((p) => ({ ...p, balance: p.balance + profit }));
        setTrading(false);
      }

      setDisplayedProfit(current);
    }, 40);

    return () => clearInterval(interval);
  }, [trading, profit]);

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
      p={4}
    >
      <VStack
        spacing={6}
        p={6}
        bg="whiteAlpha.900"
        rounded="3xl"
        shadow="2xl"
        maxW="lg"
        w="100%"
      >
        {/* ✅ BACK TO DASHBOARD */}
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Back to dashboard"
          alignSelf="flex-start"
          colorScheme="yellow"
          variant="ghost"
          onClick={() => router.push("/dashboard")}
        />

        <Heading size="xl" color="yellow.400">
          Trading Bot
        </Heading>

        <Text textAlign="center">
          Daily Target: ${TARGET_DAILY_PROFIT} | Trades Left: {tradesLeft}
        </Text>

        <Text fontWeight="bold">
          Balance: ${account.balance.toFixed(2)}
        </Text>

        <Button
          colorScheme="green"
          size="lg"
          w="100%"
          isDisabled={trading || limitReached}
          onClick={startTrade}
        >
          {trading ? "Trading..." : "Start Trading"}
        </Button>

        {trading && (
          <Box w="100%">
            <Text>Profit: ${displayedProfit.toFixed(2)}</Text>
            <Progress
              value={(displayedProfit / profit) * 100}
              colorScheme="yellow"
              size="lg"
            />
          </Box>
        )}

        {limitReached && (
          <Text color="red.500" fontWeight="bold">
            Stop! Limit exceeded, come again in 24 hours
          </Text>
        )}
      </VStack>
    </Flex>
  );
}
