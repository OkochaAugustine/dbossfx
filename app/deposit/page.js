"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Divider,
  Input,
  Select,
} from "@chakra-ui/react";
import Link from "next/link";

export default function DepositPage() {
  return (
    <Flex minH="100vh" bg="url('/images/dash-bg.png')" bgSize="cover" p={{ base: 4, md: 8 }}>
      <Box w="full" maxW="1100px" mx="auto">
        <Heading mb={6} color="white">
          Deposit Funds
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* LEFT: METHODS */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md" mb={4}>Select Method</Heading>

            <VStack spacing={4} align="stretch">
              <Button colorScheme="yellow">Crypto (BTC)</Button>
              <Button colorScheme="yellow">Crypto (USDT - TRC20)</Button>
              <Button colorScheme="yellow">Bank Transfer</Button>
            </VStack>
          </Box>

          {/* RIGHT: FORM */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md" mb={4}>Deposit Details</Heading>

            <VStack spacing={4} align="stretch">
              <Select placeholder="Select Currency">
                <option>USD</option>
                <option>NGN</option>
              </Select>

              <Input placeholder="Enter Amount" />

              <Button colorScheme="yellow" size="lg">
                Proceed to Deposit
              </Button>

              <Divider />

              <Text fontSize="sm" color="gray.600">
                Deposits are credited after network confirmation.
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* QUICK ACTION */}
        <HStack mt={8}>
          <Link href="/dashboard">
            <Button variant="outline" colorScheme="yellow">
              Back to Dashboard
            </Button>
          </Link>
        </HStack>
      </Box>
    </Flex>
  );
}
