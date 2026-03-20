"use client";

import { Box, VStack, Text, Heading, Spinner } from "@chakra-ui/react";

export default function LoadingStage1() {
  return (
    <Box
      position="fixed"
      inset={0}
      bgGradient="linear(to-r, purple.600, indigo.500)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      color="white"
      textAlign="center"
      zIndex={1000}
    >
      <VStack spacing={6}>
        <Heading fontSize="4xl" animation="pulse 2s infinite">
          🚀 Creating your account...
        </Heading>
        <Text fontSize="xl">Please hold on, something amazing is happening!</Text>
        <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="whiteAlpha.500" color="white" />
      </VStack>
    </Box>
  );
}