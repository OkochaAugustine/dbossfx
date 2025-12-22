"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Button,
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
    demoUrl: "/demo-account/standard",
    liveUrl: "/open-account/standard",
  },
  {
    name: "Pro",
    subtitle: "For Active Traders",
    spread: "From 0.6 pips",
    leverage: "Up to 1:500",
    deposit: "$500",
    demoUrl: "/demo-account/pro",
    liveUrl: "/open-account/pro",
    highlight: true,
  },
  {
    name: "Raw / ECN",
    subtitle: "For Professionals",
    spread: "From 0.0 pips",
    leverage: "Up to 1:500",
    deposit: "$1,000",
    demoUrl: "/demo-account/raw",
    liveUrl: "/open-account/raw",
  },
];

export default function AccountTypesSection() {
  return (
    <Box bg="white" py={{ base: 20, md: 28 }} px={{ base: 4, md: 12 }}>
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
            Flexible account options designed for every level of trader —
            from beginners to professionals.
          </Text>
        </Stack>

        {/* ACCOUNT GRID (DESKTOP VIEW ON MOBILE TOO) */}
        <SimpleGrid
          columns={{ base: 3, md: 3 }}
          spacing={{ base: 4, md: 8 }}
        >
          {accounts.map((account, i) => (
            <MotionBox
              key={i}
              border="1px solid"
              borderColor={account.highlight ? "yellow.400" : "gray.200"}
              rounded="2xl"
              p={{ base: 4, md: 8 }}
              textAlign="center"
              bg="white"
              shadow={{ base: "md", md: "none" }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {account.highlight && (
                <Badge mb={3} colorScheme="yellow">
                  Most Popular
                </Badge>
              )}

              <Heading fontSize={{ base: "md", md: "2xl" }}>
                {account.name}
              </Heading>

              <Text
                fontSize={{ base: "xs", md: "md" }}
                color="gray.500"
                mb={6}
              >
                {account.subtitle}
              </Text>

              <Stack spacing={2} mb={6}>
                <Text fontSize={{ base: "xs", md: "md" }}>
                  <strong>Spreads:</strong> {account.spread}
                </Text>
                <Text fontSize={{ base: "xs", md: "md" }}>
                  <strong>Leverage:</strong> {account.leverage}
                </Text>
                <Text fontSize={{ base: "xs", md: "md" }}>
                  <strong>Min Deposit:</strong> {account.deposit}
                </Text>
              </Stack>

              <Stack spacing={3}>
                <Button
                  colorScheme="yellow"
                  size={{ base: "sm", md: "lg" }}
                  w="full"
                  as="a"
                  href={account.liveUrl}
                >
                  Open Live
                </Button>

                <Button
                  variant="outline"
                  colorScheme="yellow"
                  size={{ base: "sm", md: "lg" }}
                  w="full"
                  as="a"
                  href={account.demoUrl}
                >
                  Demo
                </Button>
              </Stack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
