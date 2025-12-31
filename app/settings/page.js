"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Switch,
  Divider,
  useColorMode,
} from "@chakra-ui/react";

export default function SettingsPage() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      minH="100vh"
      px={{ base: 4, md: 8 }}
      py={6}
      bg={colorMode === "dark" ? "gray.900" : "gray.50"}
    >
      <Box
        maxW="4xl"
        mx="auto"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        rounded="2xl"
        p={6}
        shadow="xl"
      >
        <Heading mb={2}>Settings</Heading>
        <Text mb={6} color="gray.500">
          Manage your dashboard preferences
        </Text>

        <Divider mb={6} />

        {/* ===== APPEARANCE ===== */}
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Appearance</Heading>

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Dark Mode</Text>
              <Text fontSize="sm" color="gray.500">
                Toggle light / dark theme
              </Text>
            </Box>
            <Switch
              size="lg"
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
            />
          </HStack>
        </VStack>

        <Divider my={6} />

        {/* ===== FUTURE SETTINGS PLACEHOLDER ===== */}
        <VStack align="stretch" spacing={3}>
          <Heading size="md">Account</Heading>
          <Text fontSize="sm" color="gray.500">
            Profile, security, notifications (coming next)
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
