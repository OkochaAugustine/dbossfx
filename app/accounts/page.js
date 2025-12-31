"use client";

import { useState, useEffect } from "react";
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
  Progress,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

// Generate millions of dummy users for simulation
const generateUsers = (count = 1000000) => {
  const firstNames = ["Alice","Bob","Charlie","Diana","Ethan","Fiona","George","Hannah","Ibrahim","Jane"];
  const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Garcia","Wilson","Taylor"];
  const types = ["Live","Demo","Crypto","Copy Trading"];
  const users = [];
  for (let i = 0; i < count; i++) {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    const type = types[i % types.length];
    users.push({ name, type });
  }
  return users;
};

export default function AccountsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState("Live");
  const [allUsers] = useState(generateUsers(1000000));
  const [displayedUsers, setDisplayedUsers] = useState([]);

  // Cycle through users infinitely
  useEffect(() => {
    let idx = 0;
    const initialUsers = allUsers.slice(0, 10);
    setDisplayedUsers(initialUsers);

    const interval = setInterval(() => {
      setDisplayedUsers(prev => [
        ...prev.slice(1),
        allUsers[idx % allUsers.length]
      ]);
      idx++;
    }, 1500);

    return () => clearInterval(interval);
  }, [allUsers]);

  const account = { balance: 15000, profit: 2500, loss: 800 };
  const wallets = [
    { name: "Bitcoin Wallet", balance: "0.045 BTC" },
    { name: "USDT Wallet", balance: "1,250 USDT" },
    { name: "Bank Wallet", balance: "$3,200" },
  ];
  const links = ["Dashboard", "Trader", "Accounts", "History", "Settings"];
  const navigateTo = (page) => router.push(`/${page.toLowerCase()}`);

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <VStack display={{ base: "none", md: "flex" }} w="250px" flexShrink={0} bg="url('/images/side-bg.png')" bgSize="cover" bgPos="center" p={6} spacing={6} align="stretch">
        {links.map((item, i) => (
          <Button key={i} variant="ghost" justifyContent="flex-start" color="white" onClick={() => navigateTo(item)}>
            {item}
          </Button>
        ))}
        <Divider borderColor="whiteAlpha.500" />
        <HStack spacing={2}>
          <Button colorScheme="yellow" flex="1">Deposit</Button>
          <Button colorScheme="yellow" variant="outline" flex="1">Withdraw</Button>
        </HStack>
      </VStack>

      {/* Main column */}
      <Flex flex="1" direction="column">
        {/* Mobile Header */}
        <Flex display={{ base: "flex", md: "none" }} p={4} bg="url('/images/side-bg.png')" bgSize="cover" bgPos="center" justify="flex-end">
          <IconButton icon={mobileOpen ? <CloseIcon /> : <HamburgerIcon />} aria-label="Toggle Menu" onClick={() => setMobileOpen(!mobileOpen)} color="white" />
        </Flex>

        {/* Mobile Sidebar */}
        <Collapse in={mobileOpen} animateOpacity>
          <VStack display={{ base: "flex", md: "none" }} p={6} spacing={4} align="stretch" bg="url('/images/side-bg.png')" bgSize="cover" bgPos="center">
            {links.map((item, i) => (
              <Button key={i} variant="ghost" justifyContent="flex-start" color="white" onClick={() => { navigateTo(item); setMobileOpen(false); }}>
                {item}
              </Button>
            ))}
            <Divider borderColor="whiteAlpha.500" />
            <HStack spacing={2}>
              <Button colorScheme="yellow" flex="1">Deposit</Button>
              <Button colorScheme="yellow" variant="outline" flex="1">Withdraw</Button>
            </HStack>
          </VStack>
        </Collapse>

        {/* Content Area */}
        <VStack flex="1" p={6} spacing={6} align="stretch" bg="url('/images/dash-bg.png')" bgSize="cover" bgPos="center">
          <Heading mb={8} color="white">Accounts Overview</Heading>

          {/* Top Row */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
              <Text fontWeight="bold">Complete KYC to unlock withdrawals</Text>
              <Button mt={4} colorScheme="yellow" onClick={() => router.push("/kyc")}>
                Complete KYC Verification
              </Button>
            </Box>

            <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
              <Heading size="md">Account Tier</Heading>
              <Text mt={2}>Standard</Text>
              <Progress mt={3} value={35} colorScheme="yellow" />
              <Button mt={4} colorScheme="yellow">Upgrade to VIP</Button>
            </Box>

            <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
              <Heading size="md">Equity</Heading>
              <Text mt={3} fontSize="2xl" fontWeight="bold">${account.balance + account.profit - account.loss}</Text>
              <Text color="green.500">+${account.profit} Profit</Text>
              <Text color="red.500">-${account.loss} Loss</Text>
            </Box>
          </SimpleGrid>

          {/* Wallets */}
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

          {/* Registered Users */}
          <Heading mb={4} color="white">Registered Users</Heading>
          <Box maxH="350px" overflow="hidden" position="relative" rounded="2xl" bg="whiteAlpha.900" p={4} shadow="lg">
            <VStack spacing={4} align="stretch" animation="slideUp 20s linear infinite">
              {displayedUsers.map((user, idx) => (
                <Box key={idx} p={3} rounded="xl" bg="yellow.100" shadow="md" transition="all 0.3s" _hover={{ transform: "scale(1.05)", shadow: "xl" }}>
                  <Text fontWeight="bold">{user.name}</Text>
                  <Text fontSize="sm" color="gray.600">{user.type} Account</Text>
                  <Text fontSize="xs" color="green.500">Joined just now</Text>
                </Box>
              ))}
            </VStack>

            <style jsx>{`
              @keyframes slideUp {
                0% { transform: translateY(0%); }
                100% { transform: translateY(-100%); }
              }
            `}</style>
          </Box>

          {/* Trading Accounts */}
          <Heading mb={4} color="white">Trading Accounts</Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            {["Live", "Demo", "Crypto", "Copy Trading"].map((acc) => (
              <Box key={acc} bg={activeAccount === acc ? "yellow.100" : "whiteAlpha.900"} p={6} rounded="2xl" shadow="lg">
                <Heading size="sm">{acc}</Heading>
                <Button mt={4} colorScheme="yellow" variant={activeAccount === acc ? "solid" : "outline"} onClick={() => setActiveAccount(acc)}>
                  {activeAccount === acc ? "Active" : "Switch"}
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Flex>
    </Flex>
  );
}
