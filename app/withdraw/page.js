"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Input,
  Select,
  Divider,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";

export default function WithdrawPage() {
  const [method, setMethod] = useState("crypto");

  const availableBalance = 12500;
  const withdrawalFee = 25;

  return (
    <Flex
      minH="100vh"
      bg="url('/images/dash-bg.png')"
      bgSize="cover"
      bgPosition="center"
      p={{ base: 4, md: 8 }}
    >
      <Box w="full" maxW="1200px" mx="auto">
        <Heading mb={2} color="white">
          Withdraw Funds
        </Heading>
        <Text mb={6} color="whiteAlpha.800">
          Secure & fast withdrawals processed within 24 hours
        </Text>

        {/* INFO BAR */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
          <Box bg="whiteAlpha.900" p={4} rounded="xl">
            <Text fontSize="sm">Available Balance</Text>
            <Heading size="md">${availableBalance.toLocaleString()}</Heading>
          </Box>

          <Box bg="whiteAlpha.900" p={4} rounded="xl">
            <Text fontSize="sm">Withdrawal Fee</Text>
            <Heading size="md">${withdrawalFee}</Heading>
          </Box>

          <Box bg="whiteAlpha.900" p={4} rounded="xl">
            <Text fontSize="sm">Status</Text>
            <Badge colorScheme="green">Withdrawals Enabled</Badge>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* LEFT: METHOD */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md" mb={4}>
              Withdrawal Method
            </Heading>

            <VStack spacing={4} align="stretch">
              <Button
                colorScheme={method === "crypto" ? "yellow" : "gray"}
                variant={method === "crypto" ? "solid" : "outline"}
                onClick={() => setMethod("crypto")}
              >
                Crypto Wallet
              </Button>

              <Button
                colorScheme={method === "bank" ? "yellow" : "gray"}
                variant={method === "bank" ? "solid" : "outline"}
                onClick={() => setMethod("bank")}
              >
                Bank Transfer
              </Button>
            </VStack>
          </Box>

          {/* RIGHT: FORM */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md" mb={4}>
              Withdrawal Details
            </Heading>

            <VStack spacing={4} align="stretch">
              {method === "crypto" ? (
                <>
                  <Select>
                    <option>USDT (TRC20)</option>
                    <option>Bitcoin (BTC)</option>
                  </Select>

                  <Input placeholder="Wallet Address" />
                </>
              ) : (
                <>
                  <Input placeholder="Bank Name" />
                  <Input placeholder="Account Number" />
                  <Input placeholder="Account Name" />
                </>
              )}

              <Input placeholder="Withdrawal Amount" />

              <Divider />

              <Alert status="info" rounded="md">
                <AlertIcon />
                Minimum withdrawal is $100. Processing may take up to 24 hours.
              </Alert>

              <Button size="lg" colorScheme="yellow">
                Submit Withdrawal Request
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* FOOTER ACTIONS */}
        <HStack mt={8} spacing={4}>
          <Link href="/deposit">
            <Button variant="outline" colorScheme="yellow">
              Go to Deposit
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="ghost" colorScheme="yellow">
              Back to Dashboard
            </Button>
          </Link>
        </HStack>
      </Box>
    </Flex>
  );
}
