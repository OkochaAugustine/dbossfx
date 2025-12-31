"use client";

import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Select,
  SimpleGrid,
  RadioGroup,
  Radio,
  Stack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const ACCOUNT_TYPES = {
  Standard: { minDeposit: 100, spread: "From 1.2 pips" },
  ECN: { minDeposit: 300, spread: "From 0.0 pips" },
  "Raw Spread": { minDeposit: 500, spread: "From 0.0 pips + commission" },
  Pro: { minDeposit: 1000, spread: "Ultra-low spreads" },
  Islamic: { minDeposit: 200, spread: "Swap-Free" },
};

export default function CreateAccountPage() {
  const toast = useToast();
  const router = useRouter();

  const [mode, setMode] = useState("Live");
  const [accountType, setAccountType] = useState("Standard");
  const [platform, setPlatform] = useState("MT5");
  const [currency, setCurrency] = useState("USD");
  const [leverage, setLeverage] = useState("1:100");

  const handleCreateAccount = () => {
    toast({
      title: "Trading Account Created",
      description: `${mode} ${accountType} account successfully created`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    setTimeout(() => router.push("/accounts"), 1800);
  };

  return (
    <Box minH="100vh" bg="gray.50" p={6}>
      <VStack maxW="6xl" mx="auto" spacing={6} align="stretch">
        <Heading>Create Trading Account</Heading>

        <Box
          p={6}
          bg="rgba(0,0,0,0.6)"
          color="white"
          borderRadius="2xl"
          backdropFilter="blur(12px)"
          shadow="2xl"
        >
          <VStack spacing={6} align="stretch">

            {/* ACCOUNT MODE */}
            <Box>
              <Text fontWeight="bold" mb={2}>Account Mode</Text>
              <RadioGroup value={mode} onChange={setMode}>
                <Stack direction="row">
                  <Radio value="Live">Live Account</Radio>
                  <Radio value="Demo">Demo Account</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            <Divider />

            {/* ACCOUNT TYPE */}
            <Box>
              <Text fontWeight="bold" mb={2}>Account Type</Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {Object.keys(ACCOUNT_TYPES).map((type) => (
                  <Box
                    key={type}
                    p={4}
                    borderRadius="xl"
                    bg={accountType === type ? "yellow.400" : "whiteAlpha.200"}
                    color={accountType === type ? "black" : "white"}
                    cursor="pointer"
                    onClick={() => setAccountType(type)}
                    _hover={{ bg: "yellow.300", color: "black" }}
                  >
                    <Text fontWeight="bold">{type}</Text>
                    <Text fontSize="sm">
                      Spread: {ACCOUNT_TYPES[type].spread}
                    </Text>
                    <Text fontSize="sm">
                      Min Deposit: ${ACCOUNT_TYPES[type].minDeposit}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <Divider />

            {/* PLATFORM */}
            <Box>
              <Text fontWeight="bold" mb={2}>Trading Platform</Text>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value)} color="black">
                <option>MT4</option>
                <option>MT5</option>
                <option>Web Trader</option>
              </Select>
            </Box>

            {/* CURRENCY + LEVERAGE */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>Base Currency</Text>
                <Select value={currency} onChange={(e) => setCurrency(e.target.value)} color="black">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>USDT</option>
                  <option>BTC</option>
                </Select>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>Leverage</Text>
                <Select value={leverage} onChange={(e) => setLeverage(e.target.value)} color="black">
                  <option>1:10</option>
                  <option>1:50</option>
                  <option>1:100</option>
                  <option>1:200</option>
                  <option>1:500</option>
                </Select>
              </Box>
            </SimpleGrid>

            {/* SUMMARY */}
            <Box bg="blackAlpha.400" p={4} borderRadius="xl">
              <Text fontWeight="bold">Account Summary</Text>
              <Text>Mode: {mode}</Text>
              <Text>Type: {accountType}</Text>
              <Text>Platform: {platform}</Text>
              <Text>Currency: {currency}</Text>
              <Text>Leverage: {leverage}</Text>
              <Text>
                Minimum Deposit: $
                {ACCOUNT_TYPES[accountType].minDeposit}
              </Text>
            </Box>

            <Button
              colorScheme="yellow"
              size="lg"
              onClick={handleCreateAccount}
            >
              Create Trading Account
            </Button>

          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
