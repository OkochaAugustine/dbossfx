"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { useAccount } from "@/app/hooks/useAccount";

export default function HistoryPage() {
  const { account, loading } = useAccount();

  const [stats, setStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  useEffect(() => {
    if (!account) return;

    const total = Number(account.earned_profit || 0);

    setStats({
      daily: total * 0.2,
      weekly: total * 0.5,
      monthly: total,
    });
  }, [account]);

  if (loading) {
    return (
      <Flex
        minH="100vh"
        w="100%"
        align="center"
        justify="center"
        overflowX="hidden"
      >
        <Spinner size="xl" color="yellow.400" />
      </Flex>
    );
  }

  if (!account) {
    return (
      <Flex
        minH="100vh"
        w="100%"
        align="center"
        justify="center"
        overflowX="hidden"
      >
        <Text>No trading history available.</Text>
      </Flex>
    );
  }

  return (
    <Flex
      minH="100vh"
      w="100%"
      overflowX="hidden"
      bg="url('/images/history-bg.jpg')"
      bgSize="cover"
      bgPos="center"
      px={{ base: 4, md: 6 }}
      py={6}
    >
      <Box
        bg="whiteAlpha.900"
        rounded="2xl"
        shadow="2xl"
        p={{ base: 4, md: 6 }}
        w="100%"
        maxW="6xl"
        mx="auto"
        overflowX="hidden"
      >
        <Heading mb={4}>Trading History</Heading>

        {/* ===== STATS ===== */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
          <StatCard
            title="Daily Profit"
            value={`$${stats.daily.toFixed(2)}`}
          />
          <StatCard
            title="Weekly Profit"
            value={`$${stats.weekly.toFixed(2)}`}
          />
          <StatCard
            title="Monthly Profit"
            value={`$${stats.monthly.toFixed(2)}`}
          />
        </SimpleGrid>

        {/* ===== LAST DEPOSIT ===== */}
        <Box mb={6}>
          <Heading size="md" mb={2}>
            Last Deposit
          </Heading>
          <Text>
            ${Number(account.active_deposit || 0).toFixed(2)}
          </Text>
          <Text fontSize="sm" color="gray.600">
            Updated: {new Date(account.updated_at).toLocaleString()}
          </Text>
        </Box>

        <Divider my={4} />

        {/* ===== ACCOUNT SUMMARY ===== */}
        <Heading size="md" mb={3}>
          Account Summary
        </Heading>

        <VStack align="start" spacing={2}>
          <Text>
            <strong>Total Earned Profit:</strong>{" "}
            ${Number(account.earned_profit || 0).toFixed(2)}
          </Text>
          <Text>
            <strong>Account Balance:</strong>{" "}
            ${Number(account.balance || 0).toFixed(2)}
          </Text>
          <Text>
            <strong>Active Deposit:</strong>{" "}
            ${Number(account.active_deposit || 0).toFixed(2)}
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}

function StatCard({ title, value }) {
  return (
    <Box
      p={4}
      bg="gray.100"
      rounded="xl"
      textAlign="center"
      w="100%"
    >
      <Text fontSize="sm" color="gray.600">
        {title}
      </Text>
      <Heading size="lg">{value}</Heading>
    </Box>
  );
}
