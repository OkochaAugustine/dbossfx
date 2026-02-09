"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const accounts = [
  {
    name: "Standard",
    subtitle: "Best for Beginners",
    spread: "From 1.2 pips",
    leverage: "Up to 1:500",
    deposit: "$100",
    highlight: false,
  },
  {
    name: "Pro",
    subtitle: "For Active Traders",
    spread: "From 0.6 pips",
    leverage: "Up to 1:500",
    deposit: "$500",
    highlight: true,
  },
  {
    name: "Raw / ECN",
    subtitle: "For Professionals",
    spread: "From 0.0 pips",
    leverage: "Up to 1:500",
    deposit: "$1,000",
    highlight: false,
  },
];

export default function AccountTypesSection() {
  return (
    <Box bg="gray.50" py={{ base: 20, md: 28 }} px={{ base: 4, md: 12 }}>
      <Stack maxW="1400px" mx="auto" spacing={{ base: 12, md: 16 }}>
        
        {/* HEADER */}
        <Stack spacing={4} textAlign="center">
          <Badge colorScheme="yellow" w="fit-content" mx="auto">
            Account Types
          </Badge>

          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Choose the Account That Fits Your Trading Style
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Flexible account options designed for every level of trader — from beginners to professionals. 
            Explore the features, spreads, leverage, and minimum deposits to find the account that suits your strategy.
          </Text>
        </Stack>

        {/* PINTEREST-STYLE GRID */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {accounts.map((account, i) => (
            <MotionBox
              key={i}
              border="1px solid"
              borderColor={account.highlight ? "yellow.400" : "gray.200"}
              rounded="2xl"
              p={{ base: 6, md: 8 }}
              bg="white"
              shadow="xl"
              whileHover={{ y: -8, shadow: "2xl" }}
              transition={{ duration: 0.3 }}
            >
              {account.highlight && (
                <Badge mb={4} colorScheme="yellow">
                  Most Popular
                </Badge>
              )}

              <Heading fontSize={{ base: "xl", md: "2xl" }} mb={2}>
                {account.name}
              </Heading>

              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.500"
                mb={4}
              >
                {account.subtitle}
              </Text>

              <Stack spacing={2}>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  <strong>Spreads:</strong> {account.spread}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  <strong>Leverage:</strong> {account.leverage}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  <strong>Min Deposit:</strong> {account.deposit}
                </Text>
              </Stack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
