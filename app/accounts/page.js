"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Divider,
  IconButton,
  Collapse,
  SimpleGrid,
  Badge,
  Progress,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [activeAccount, setActiveAccount] = useState("Live");

  const account = {
    balance: 15000,
    profit: 2500,
    loss: 800,
  };

  const wallets = [
    { name: "Bitcoin Wallet", balance: "0.045 BTC" },
    { name: "USDT Wallet", balance: "1,250 USDT" },
    { name: "Bank Wallet", balance: "$3,200" },
  ];

  const navigateTo = (page) => router.push(`/${page.toLowerCase()}`);

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
      {/* ===== SIDEBAR (UNCHANGED) ===== */}
      <VStack
        w={{ base: "full", md: "250px" }}
        p={6}
        spacing={6}
        align="stretch"
        bgImage="url('/images/side-bg.png')"
        bgSize="cover"
      >
        <Flex justify="space-between" align="center" display={{ base: "flex", md: "none" }}>
          <Heading size="md" color="white">DbossFX</Heading>
          <IconButton
            icon={isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          />
        </Flex>

        <Collapse in={isSidebarOpen || { base: true, md: false }}>
          <VStack align="stretch" spacing={4}>
            {["Dashboard", "Trader", "Accounts", "History", "Settings"].map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                justifyContent="flex-start"
                color="white"
                onClick={() => navigateTo(item)}
              >
                {item}
              </Button>
            ))}

            <Divider borderColor="whiteAlpha.500" />

            <HStack>
              <Button colorScheme="yellow" flex="1">Deposit</Button>
              <Button colorScheme="yellow" variant="outline" flex="1">Withdraw</Button>
            </HStack>

            <VStack align="stretch">
              <Text color="white" fontWeight="bold">Account Balance</Text>
              <Text color="white">
                {showValues
                  ? `$${account.balance.toLocaleString()} (P: $${account.profit}, L: $${account.loss})`
                  : "****"}
              </Text>
              <IconButton
                icon={showValues ? <ViewIcon /> : <ViewOffIcon />}
                size="sm"
                onClick={() => setShowValues(!showValues)}
                colorScheme="yellow"
              />
            </VStack>
          </VStack>
        </Collapse>
      </VStack>

      {/* ===== BODY (DESKTOP GRID + BACKGROUND) ===== */}
      <Box
        flex="1"
        p={8}
        bgImage="url('/images/dash-bg.png')"
        bgSize="cover"
        bgPosition="center"
      >
        <Heading mb={8} color="white">
          Accounts Overview
        </Heading>

        {/* ===== TOP ROW ===== */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md">KYC Status</Heading>
            <Badge mt={2} colorScheme="red">Not Verified</Badge>
            <Text mt={3}>Complete KYC to unlock withdrawals.</Text>
            <Button mt={4} colorScheme="yellow">Verify Now</Button>
          </Box>

          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md">Account Tier</Heading>
            <Text mt={2}>Standard</Text>
            <Progress mt={3} value={35} colorScheme="yellow" />
            <Button mt={4} colorScheme="yellow">Upgrade to VIP</Button>
          </Box>

          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md">Equity</Heading>
            <Text mt={3} fontSize="2xl" fontWeight="bold">
              ${account.balance + account.profit - account.loss}
            </Text>
            <Text color="green.500">+${account.profit} Profit</Text>
            <Text color="red.500">-${account.loss} Loss</Text>
          </Box>
        </SimpleGrid>

        {/* ===== WALLETS ROW ===== */}
        <Heading mb={4} color="white">Funding Wallets</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          {wallets.map((wallet, i) => (
            <Box key={i} bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
              <Heading size="sm">{wallet.name}</Heading>
              <Text mt={2} fontWeight="bold">{wallet.balance}</Text>
              <HStack mt={4}>
                <Button size="sm" colorScheme="yellow">Deposit</Button>
                <Button size="sm" variant="outline">Withdraw</Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* ===== TRADING ACCOUNTS ROW ===== */}
        <Heading mb={4} color="white">Trading Accounts</Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          {["Live", "Demo", "Crypto", "Copy Trading"].map((acc) => (
            <Box
              key={acc}
              bg={activeAccount === acc ? "yellow.100" : "whiteAlpha.900"}
              p={6}
              rounded="2xl"
              shadow="lg"
            >
              <Heading size="sm">{acc}</Heading>
              <Button
                mt={4}
                colorScheme="yellow"
                variant={activeAccount === acc ? "solid" : "outline"}
                onClick={() => setActiveAccount(acc)}
              >
                {activeAccount === acc ? "Active" : "Switch"}
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
