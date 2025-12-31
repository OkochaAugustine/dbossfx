"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Text, Spinner, Flex, Center } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { supabase } from "@/lib/supabaseClient";

export default function AccountStatement({ userId, isCompact, mobile }) {
  const [account, setAccount] = useState(null);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [displayProfit, setDisplayProfit] = useState(0);
  const [displayDeposit, setDisplayDeposit] = useState(0);
  const [profitAnim, setProfitAnim] = useState(null);
  const [depositAnim, setDepositAnim] = useState(null);
  const [bigFlash, setBigFlash] = useState(false);
  const [loading, setLoading] = useState(true);

  const prevBalanceRef = useRef(0);
  const prevProfitRef = useRef(0);
  const prevDepositRef = useRef(0);

  const rafRefs = {
    balance: useRef(null),
    profit: useRef(null),
    deposit: useRef(null),
  };

  const glowGreen = keyframes`
    0% { background: rgba(0,255,0,0.25); }
    100% { background: transparent; }
  `;
  const glowRed = keyframes`
    0% { background: rgba(255,0,0,0.25); }
    100% { background: transparent; }
  `;
  const bigProfitFlash = keyframes`
    0% { box-shadow: 0 0 30px rgba(0,255,0,0.9); }
    100% { box-shadow: none; }
  `;

  const animateValue = (from, to, setter, key, duration = 600) => {
    const start = performance.now();
    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setter(from + (to - from) * progress);
      if (progress < 1) rafRefs[key].current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(rafRefs[key].current);
    rafRefs[key].current = requestAnimationFrame(animate);
  };

  const fetchAccount = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("account_statements")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) return;

      const profitDiff = data.earned_profit - prevProfitRef.current;
      if (profitDiff !== 0) {
        setProfitAnim(profitDiff > 0 ? "up" : "down");
        if (Math.abs(profitDiff) >= 100) {
          setBigFlash(true);
          setTimeout(() => setBigFlash(false), 900);
        }
        setTimeout(() => setProfitAnim(null), 700);
      }

      const depositDiff = data.active_deposit - prevDepositRef.current;
      if (depositDiff !== 0) {
        setDepositAnim(depositDiff > 0 ? "up" : "down");
        setTimeout(() => setDepositAnim(null), 700);
      }

      animateValue(prevBalanceRef.current, data.balance, setDisplayBalance, "balance");
      animateValue(prevProfitRef.current, data.earned_profit, setDisplayProfit, "profit");
      animateValue(prevDepositRef.current, data.active_deposit, setDisplayDeposit, "deposit");

      prevBalanceRef.current = data.balance;
      prevProfitRef.current = data.earned_profit;
      prevDepositRef.current = data.active_deposit;

      setAccount({
        balance: data.balance,
        earnedProfit: data.earned_profit,
        activeDeposit: data.active_deposit,
        tradingAccountCreated: true,
        id: data.id,
      });

      setLoading(false);
    } catch (err) {
      console.error("Account fetch failed:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchAccount();
    const interval = setInterval(fetchAccount, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <Center minH="100px">
        <Spinner size="md" color="yellow.400" />
      </Center>
    );
  }

  return (
    <Flex
      p={4}
      borderRadius="2xl"
      bg="rgba(0,0,0,0.55)"
      backdropFilter="blur(12px)"
      color="white"
      shadow="2xl"
      animation={bigFlash ? `${bigProfitFlash} 0.9s ease-out` : "none"}
      direction={mobile || isCompact ? "row" : "row"}
      align="center"
      justify="flex-start"
      gap={3}
      flexWrap="wrap"
      flex="1"
      minWidth={0}
      overflow="hidden"
    >
      <Text fontSize={mobile || isCompact ? "sm" : "md"} fontWeight="bold" minWidth={0} flexShrink={1} isTruncated>
        💰 Balance: ${displayBalance.toFixed(2)}
      </Text>
      <Text fontSize={mobile || isCompact ? "sm" : "md"} fontWeight="bold" minWidth={0} flexShrink={1} isTruncated
        animation={profitAnim === "up" ? `${glowGreen} 0.7s ease-out` : profitAnim === "down" ? `${glowRed} 0.7s ease-out` : "none"}
      >
        📈 Profit: ${displayProfit.toFixed(2)}
      </Text>
      <Text fontSize={mobile || isCompact ? "sm" : "md"} fontWeight="bold" minWidth={0} flexShrink={1} isTruncated
        animation={depositAnim === "up" ? `${glowGreen} 0.7s ease-out` : depositAnim === "down" ? `${glowRed} 0.7s ease-out` : "none"}
      >
        💵 Deposit: ${displayDeposit.toFixed(2)}
      </Text>
    </Flex>
  );
}
