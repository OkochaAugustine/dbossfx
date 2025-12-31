"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  Select,
  Button,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

// Payment & Deposit options
const paymentMethods = ["Bank Transfer", "BTC Wallet", "Bank Payment", "PayPal"];
const depositMethods = ["Bank Transfer", "Crypto Deposit", "Card Payment"];

// Example assets
const tradableAssets = [
  "EUR/USD", "USD/JPY", "GBP/USD", "BTC/USD", "ETH/USD", "AAPL", "MSFT", "GOOGL",
];

export default function TradingAccountSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    paymentMethod: "",
    depositMethod: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tradePage, setTradePage] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Show loading animation
    setLoading(true);

    // Simulate async account creation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // After a few seconds, go to trade page
      setTimeout(() => {
        setTradePage(true);
      }, 2000);
    }, 2500);
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="gray.900">
        <VStack spacing={4}>
          <Spinner size="xl" color="yellow.400" />
          <Text fontSize="xl" color="white">Creating your trading account...</Text>
        </VStack>
      </Flex>
    );
  }

  if (success && !tradePage) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="green.900">
        <VStack spacing={4}>
          <Heading size="lg" color="yellow.400">Congratulations Trader!</Heading>
          <Text color="white" fontSize="lg">Your trading account is successfully created.</Text>
        </VStack>
      </Flex>
    );
  }

  if (tradePage) {
    return (
      <Flex h="100vh" direction="column" align="center" justify="center" p={6} bg="gray.50" gap={6}>
        <Heading>Automated Trading Bot</Heading>
        <Text fontSize="lg" color="gray.700">DBossFX will trade for you with 100% profit potential.</Text>
        
        <VStack spacing={4} w="full" maxW="400px">
          <Input
            placeholder="Enter amount to trade"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.target.value)}
          />

          <Select
            placeholder="Select asset"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
          >
            {tradableAssets.map((asset) => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </Select>

          <Button
            colorScheme="yellow"
            w="full"
            onClick={() => alert(`Your profit is on the way! Trading ${selectedAmount} on ${selectedAsset}.`)}
          >
            Start Trading
          </Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" align="center" justify="center" bg="gray.900">
      <VStack spacing={6} p={6} bg="gray.800" rounded="2xl" w={{ base: "90%", md: "500px" }} shadow="2xl">
        <Heading color="yellow.400">Create Trading Account</Heading>
        <Text color="white" textAlign="center">
          DBossFX trades automatically for you to ensure maximum profit with zero commission.
        </Text>

        <Input
          placeholder="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          bg="white"
        />
        <Input
          placeholder="Mobile Number"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          bg="white"
        />
        <Select
          placeholder="Select Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          bg="white"
        >
          {paymentMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </Select>
        <Select
          placeholder="Select Deposit Method"
          name="depositMethod"
          value={formData.depositMethod}
          onChange={handleChange}
          bg="white"
        >
          {depositMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </Select>

        <Button colorScheme="green" w="full" onClick={handleSubmit}>
          Create Your Account
        </Button>
      </VStack>
    </Flex>
  );
}
