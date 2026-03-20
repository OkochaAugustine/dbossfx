"use client";

import { useEffect, useState } from "react";
import { Box, VStack, Heading, Text, Spinner, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function AccountCreationAnimation({ onComplete }) {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    let timer;
    if (stage === 1) timer = setTimeout(() => setStage(2), 5000); // Stage 1 longer for realism
    if (stage === 2) timer = setTimeout(() => setStage(3), 4000); // Stage 2 duration
    if (stage === 3) timer = setTimeout(() => onComplete(), 4000); // Stage 3 duration
    return () => clearTimeout(timer);
  }, [stage, onComplete]);

  // Particles for stage 1
  const particles = [...Array(15)].map((_, i) => (
    <MotionBox
      key={i}
      position="absolute"
      top={`${Math.random() * 100}%`}
      left={`${Math.random() * 100}%`}
      w={`${Math.random() * 8 + 4}px`}
      h={`${Math.random() * 8 + 4}px`}
      borderRadius="full"
      bg={`hsla(${Math.random() * 360}, 70%, 60%, 0.9)`}
      animate={{ y: [0, 50 + Math.random() * 50, 0], x: [0, 50 - Math.random() * 50, 0], rotate: [0, 360] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
    />
  ));

  if (stage === 1) {
    return (
      <Box
        position="fixed"
        inset={0}
        bgGradient="linear(to-br, purple.800, pink.600)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        color="white"
        zIndex={1000}
        overflow="hidden"
      >
        {particles}
        <VStack spacing={6} zIndex={10}>
          <MotionBox
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heading fontSize="4xl" textAlign="center">🚀 Creating your DbossFX account...</Heading>
          </MotionBox>
          <Text fontSize="xl">Setting up your trading environment. Please hold on!</Text>
          <Spinner size="xl" thickness="5px" speed="0.6s" emptyColor="whiteAlpha.500" color="white" />
        </VStack>
      </Box>
    );
  }

  if (stage === 2) {
    return (
      <Box
        position="fixed"
        inset={0}
        bgGradient="linear(to-br, blue.500, teal.500)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        color="white"
        zIndex={1000}
        overflow="hidden"
      >
        <VStack spacing={6}>
          <MotionBox
            animate={{ y: [0, -10, 10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heading fontSize="4xl">🔎 Verifying your account...</Heading>
          </MotionBox>
          <Text fontSize="xl">Almost done! Confirming your account details…</Text>
          <Box w="300px" h="10px" bg="whiteAlpha.300" borderRadius="md" overflow="hidden">
            <MotionBox
              h="100%"
              w="0%"
              bg="white"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </Box>
        </VStack>
      </Box>
    );
  }

  if (stage === 3) {
    const confetti = [...Array(12)].map((_, i) => (
      <MotionBox
        key={i}
        position="absolute"
        top={-10}
        left={`${Math.random() * 100}%`}
        w={`${Math.random() * 10 + 6}px`}
        h={`${Math.random() * 10 + 6}px`}
        borderRadius="full"
        bg={`hsl(${Math.random() * 360}, 80%, 60%)`}
        animate={{ y: [0, 400 + Math.random() * 200], rotate: [0, 360] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
      />
    ));

    return (
      <Box
        position="fixed"
        inset={0}
        bgGradient="linear(to-br, yellow.400, orange.500)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        color="white"
        zIndex={1000}
        overflow="hidden"
      >
        {confetti}
        <VStack spacing={6}>
          <MotionBox
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heading fontSize="4xl">🎉 Congratulations!</Heading>
          </MotionBox>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Your DbossFX account has been successfully created!
          </Text>
        </VStack>
      </Box>
    );
  }

  return null;
}