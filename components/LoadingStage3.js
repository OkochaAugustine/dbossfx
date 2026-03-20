"use client";

import { Box, VStack, Text, Heading } from "@chakra-ui/react";

export default function LoadingStage3() {
  return (
    <Box
      position="fixed"
      inset={0}
      bgGradient="linear(to-r, yellow.400, orange.500)"
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
          🎉 Congratulations!
        </Heading>
        <Text fontSize="xl">Your DbossFX account has been created successfully!</Text>
      </VStack>
    </Box>
  );
}