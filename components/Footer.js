"use client";

import { Box, Text, Stack } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="black" color="white" py={8} textAlign="center">
      <Stack spacing={2}>
        <Text>© 2025 DbossFX. All rights reserved.</Text>
        <Text>Trade Smart. Trade Global.</Text>
      </Stack>
    </Box>
  );
}
