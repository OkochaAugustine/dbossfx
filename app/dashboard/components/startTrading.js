"use client";

import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  VStack,
  Text,
  Button,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// Import statTrading component
import StatTrading from "../components/stattrading";

export default function StartTradingPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showTradingBot, setShowTradingBot] = useState(false);

  // Get current user
  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (user) setUserId(user.id);
    };

    getUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch user-specific account statement
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    setLoading(true);

    const fetchAccount = async () => {
      try {
        const { data, error } = await supabase
          .from("account_statements")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (!isMounted) return;

        if (error || !data) {
          setAccount({ balance: 0 });
        } else {
          setAccount(data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setAccount({ balance: 0 });
        setLoading(false);
      }
    };

    fetchAccount();

    const interval = setInterval(fetchAccount, 5000);
    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <Flex
        h="100vh"
        align="center"
        justify="center"
        overflowX="hidden"   // ✅ FIX
      >
        <Spinner size="xl" color="yellow.400" />
      </Flex>
    );
  }

  // If user clicked Start Trading, show the bot page
  if (showTradingBot) {
    return (
      <Box w="100%" overflowX="hidden"> {/* ✅ FIX */}
        <StatTrading userId={userId} />
      </Box>
    );
  }

  return (
    <Flex
      h="100vh"
      w="100%"
      align="center"
      justify="center"
      bg="gray.50"
      p={6}
      overflowX="hidden"   // ✅ FIX
    >
      <VStack
        spacing={6}
        p={6}
        bg="white"
        rounded="2xl"
        shadow="2xl"
        maxW="100%"
        overflowX="hidden" // ✅ FIX
      >
        {account.balance === 0 ? (
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
        ) : (
          <>
            <Heading color="green.500" size="lg">
              Ready to Trade!
            </Heading>
            <Text fontSize="md" color="gray.700" textAlign="center">
              Your account balance is $
              {Number(account.balance).toFixed(2)}. Click below to start trading.
            </Text>
            <Button colorScheme="green" onClick={() => setShowTradingBot(true)}>
              Start Trading
            </Button>
          </>
        )}
      </VStack>
    </Flex>
  );
}
