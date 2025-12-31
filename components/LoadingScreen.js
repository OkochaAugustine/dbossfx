// app/components/LoadingScreen.js
"use client";

import { Box, VStack, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react"; // ✅ Correct import

export default function LoadingScreen({ type = "dashboard" }) {
  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  const spinAnim = `${spin} 1.5s linear infinite`;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="blackAlpha.900"
      zIndex="9999"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={6}>
        {/* Neon spinning circle */}
        <Box
          border="6px solid transparent"
          borderTop="6px solid #FFD700"
          borderRadius="full"
          w="20"
          h="20"
          animation={spinAnim}
          boxShadow="0 0 20px #FFD700, 0 0 40px #FF6347, 0 0 60px #00FFFF"
        />

        {/* Glowing text */}
        <Text
          fontSize="2xl"
          color="yellow.300"
          textShadow="0 0 10px #FFD700, 0 0 20px #FF6347"
          fontWeight="bold"
        >
          Loading Dashboard...
        </Text>
      </VStack>
    </Box>
  );
}
