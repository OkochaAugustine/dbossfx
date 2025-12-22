"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Divider,
  IconButton,
  Collapse,
  SimpleGrid,
  Switch,
  Select,
  Input,
  Badge,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  LockIcon,
  BellIcon,
  SettingsIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigateTo = (page) => router.push(`/${page.toLowerCase()}`);

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
      {/* ===== SIDEBAR (UNCHANGED) ===== */}
      <VStack
        w={{ base: "full", md: "250px" }}
        p={6}
        spacing={6}
        align="stretch"
        bgImage="url('/images/side-bg.png')"
        bgSize="cover"
      >
        <Flex justify="space-between" align="center" display={{ base: "flex", md: "none" }}>
          <Heading size="md" color="white">DbossFX</Heading>
          <IconButton
            icon={isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          />
        </Flex>

        <Collapse in={isSidebarOpen || { base: true, md: false }}>
          <VStack align="stretch" spacing={4}>
            {["Dashboard", "Trader", "Accounts", "History", "Settings"].map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                justifyContent="flex-start"
                color="white"
                onClick={() => navigateTo(item)}
              >
                {item}
              </Button>
            ))}

            <Divider borderColor="whiteAlpha.500" />

            <HStack>
              <Button colorScheme="yellow" flex="1">Deposit</Button>
              <Button colorScheme="yellow" variant="outline" flex="1">Withdraw</Button>
            </HStack>
          </VStack>
        </Collapse>
      </VStack>

      {/* ===== BODY ===== */}
      <Box
        flex="1"
        p={{ base: 4, md: 8 }}
        bgImage="url('/images/dash-bg.png')"
        bgSize="cover"
        bgPosition="center"
      >
        <Heading mb={8} color="white">
          Settings
        </Heading>

        {/* ===== SETTINGS GRID ===== */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* ACCOUNT */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <HStack mb={4}>
              <SettingsIcon />
              <Heading size="md">Account</Heading>
            </HStack>

            <VStack spacing={3} align="stretch">
              <Input placeholder="Full Name" />
              <Input placeholder="Email Address" />
              <Input placeholder="Phone Number" />
              <Button colorScheme="yellow">Save Changes</Button>
            </VStack>
          </Box>

          {/* SECURITY */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <HStack mb={4}>
              <LockIcon />
              <Heading size="md">Security</Heading>
            </HStack>

            <VStack spacing={4} align="stretch">
              <Button>Change Password</Button>

              <HStack justify="space-between">
                <Text>Two-Factor Authentication</Text>
                <Switch colorScheme="yellow" />
              </HStack>

              <Badge colorScheme="green" w="fit-content">
                Account Protected
              </Badge>
            </VStack>
          </Box>

          {/* PREFERENCES */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <HStack mb={4}>
              <SettingsIcon />
              <Heading size="md">Preferences</Heading>
            </HStack>

            <VStack spacing={4} align="stretch">
              <Select>
                <option>USD ($)</option>
                <option>NGN (₦)</option>
                <option>EUR (€)</option>
              </Select>

              <Select>
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </Select>

              <HStack justify="space-between">
                <Text>Dark Mode</Text>
                <Switch colorScheme="yellow" />
              </HStack>
            </VStack>
          </Box>

          {/* NOTIFICATIONS */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <HStack mb={4}>
              <BellIcon />
              <Heading size="md">Notifications</Heading>
            </HStack>

            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text>Email Alerts</Text>
                <Switch colorScheme="yellow" />
              </HStack>

              <HStack justify="space-between">
                <Text>Trade Signals</Text>
                <Switch colorScheme="yellow" />
              </HStack>

              <HStack justify="space-between">
                <Text>Withdrawal Updates</Text>
                <Switch colorScheme="yellow" />
              </HStack>
            </VStack>
          </Box>

          {/* TRADING */}
          <Box bg="whiteAlpha.900" p={6} rounded="2xl" shadow="lg">
            <Heading size="md" mb={4}>Trading Controls</Heading>

            <VStack spacing={4} align="stretch">
              <Select>
                <option>Low Risk</option>
                <option>Medium Risk</option>
                <option>High Risk</option>
              </Select>

              <HStack justify="space-between">
                <Text>Enable Copy Trading</Text>
                <Switch colorScheme="yellow" />
              </HStack>
            </VStack>
          </Box>

          {/* DANGER ZONE */}
          <Box bg="red.50" p={6} rounded="2xl" border="1px solid" borderColor="red.200">
            <HStack mb={4}>
              <WarningIcon color="red.500" />
              <Heading size="md" color="red.600">Danger Zone</Heading>
            </HStack>

            <VStack spacing={3} align="stretch">
              <Button colorScheme="red" variant="outline">
                Logout
              </Button>

              <Button colorScheme="red">
                Deactivate Account
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
