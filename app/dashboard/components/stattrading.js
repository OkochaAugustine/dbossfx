"use client";

import { useState } from "react";
import { Flex, VStack, Text, Heading, Button, Box, ScaleFade } from "@chakra-ui/react";
import StarTrading from "./startrading"; // import your StarTrading component

export default function StatTrading({ userId }) {
  const [animate, setAnimate] = useState(false);
  const [showStarTrading, setShowStarTrading] = useState(false);

  const handleStartTrading = () => {
    setAnimate(true); // trigger animation before showing next component
    setTimeout(() => {
      setShowStarTrading(true); // show the bot trading component
    }, 1000); // 1s delay for animation
  };

  if (showStarTrading) {
    // Render the StarTrading page dynamically
    return <StarTrading userId={userId} />;
  }

  return (
    <Flex
      h="100vh"
      w="100vw"
      bgImage="url('/images/start-bg.jpg')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      align="center"
      justify="center"
      position="relative"
      overflow="hidden"
    >
      {/* Animated overlay */}
      <Box position="absolute" top={0} left={0} w="100%" h="100%" bg="blackAlpha.600" />

      <ScaleFade initialScale={0.8} in={!animate}>
        <VStack
          spacing={6}
          p={8}
          bg="whiteAlpha.800"
          rounded="3xl"
          shadow="2xl"
          backdropFilter="blur(12px)"
          zIndex={1}
          align="center"
          maxW="3xl"
          textAlign="center"
        >
          <Heading size="2xl" color="yellow.400" textShadow="2px 2px black">
            Welcome to DBossFX Trading Bot
          </Heading>
          <Text fontSize="lg" color="gray.900" maxW="2xl">
            Our AI-powered bot executes high-probability trades across Forex, Crypto, and Stocks
            with real-time market data, indicators (Moving Average, RSI, Bollinger Bands, MACD,
            Stochastic), and breaking news analysis. Enjoy 100% intelligent trading with zero
            commission!
          </Text>

          <Text fontSize="md" color="gray.700">
            Your account is ready. Select the amount and start trading to see your profits grow
            instantly.
          </Text>

          <Button
            colorScheme="green"
            size="lg"
            px={12}
            py={6}
            fontSize="xl"
            boxShadow="xl"
            _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}
            _active={{ transform: "scale(0.98)" }}
            onClick={handleStartTrading}
          >
            Start Trading
          </Button>
        </VStack>
      </ScaleFade>

      {/* Animated shapes */}
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
        animation="pulse 6s infinite"
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
        animation="pulse 8s infinite alternate"
      />

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(0.8); opacity: 0.6; }
        }
      `}</style>
    </Flex>
  );
}
