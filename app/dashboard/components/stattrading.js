"use client";

import { useState } from "react";
import {
  Flex,
  VStack,
  Text,
  Heading,
  Button,
  Box,
} from "@chakra-ui/react";
import StarTrading from "./startrading";

export default function StatTrading({ userId }) {
  const [showStarTrading, setShowStarTrading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartTrading = () => {
    if (loading) return; // prevent double taps
    setLoading(true);
    setShowStarTrading(true); // INSTANT transition
  };

  if (showStarTrading) {
    return <StarTrading userId={userId} />;
  }

  return (
    <Flex
      h="100dvh"
      w="100vw"
      bgImage="url('/images/start-bg.jpg')"
      bgSize="cover"
      bgPos="center"
      align="center"
      justify="center"
      position="relative"
      overflow="hidden"
    >
      {/* Overlay */}
      <Box
        position="absolute"
        inset={0}
        bg="blackAlpha.600"
        pointerEvents="none"
      />

      {/* Main Card */}
      <VStack
        spacing={6}
        p={{ base: 5, md: 8 }}
        bg="whiteAlpha.900"
        rounded="3xl"
        shadow="2xl"
        backdropFilter="blur(12px)"
        zIndex={1}
        align="center"
        maxW="3xl"
        textAlign="center"
        transition="all 0.25s ease"
      >
        <Heading
          size={{ base: "lg", md: "2xl" }}
          color="yellow.400"
          textShadow="2px 2px black"
        >
          Welcome to DBossFX Trading Bot
        </Heading>

        <Text fontSize={{ base: "sm", md: "lg" }} color="gray.900">
          Our AI-powered bot executes high-probability trades across Forex,
          Crypto, and Stocks using real-time indicators and news analysis.
        </Text>

        <Text fontSize={{ base: "sm", md: "md" }} color="gray.700">
          Your account is ready. Tap below to start trading instantly.
        </Text>

        {/* ✅ MOBILE-OPTIMIZED BUTTON */}
        <Button
          colorScheme="green"
          size="lg"
          px={{ base: 8, md: 12 }}
          py={{ base: 6, md: 7 }}
          fontSize={{ base: "lg", md: "xl" }}
          boxShadow="xl"
          isLoading={loading}
          loadingText="Starting..."
          onClick={handleStartTrading}
          touchAction="manipulation"
          minH="56px"
          _active={{ transform: "scale(0.96)" }}
        >
          Start Trading
        </Button>
      </VStack>

      {/* Decorative blobs */}
      <Box
        position="absolute"
        w="200px"
        h="200px"
        bg="yellow.300"
        borderRadius="full"
        top="10%"
        left="5%"
        filter="blur(120px)"
        opacity={0.6}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        w="300px"
        h="300px"
        bg="green.300"
        borderRadius="full"
        bottom="10%"
        right="5%"
        filter="blur(150px)"
        opacity={0.5}
        pointerEvents="none"
      />
    </Flex>
  );
}
