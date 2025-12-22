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
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const historyData = [
    {
      type: "Deposit",
      method: "USDT (TRC20)",
      amount: "+$1,000",
      status: "Completed",
      date: "2025-01-12",
    },
    {
      type: "Trade",
      method: "EUR/USD",
      amount: "+$320",
      status: "Profit",
      date: "2025-01-11",
    },
    {
      type: "Withdrawal",
      method: "Bank Transfer",
      amount: "-$500",
      status: "Pending",
      date: "2025-01-10",
    },
    {
      type: "Copy Trade",
      method: "Master Trader A",
      amount: "+$210",
      status: "Profit",
      date: "2025-01-09",
    },
  ];

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
        <Heading mb={6} color="white">
          Transaction History
        </Heading>

        {/* ===== SUMMARY CARDS (RESPONSIVE) ===== */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          <Box bg="whiteAlpha.900" p={4} rounded="2xl">
            <Text fontSize="sm">Deposits</Text>
            <Heading size="sm">$12,500</Heading>
          </Box>

          <Box bg="whiteAlpha.900" p={4} rounded="2xl">
            <Text fontSize="sm">Withdrawals</Text>
            <Heading size="sm">$4,300</Heading>
          </Box>

          <Box bg="whiteAlpha.900" p={4} rounded="2xl">
            <Text fontSize="sm">Trades</Text>
            <Heading size="sm">128</Heading>
          </Box>

          <Box bg="whiteAlpha.900" p={4} rounded="2xl">
            <Text fontSize="sm">Net P/L</Text>
            <Heading size="sm" color="green.500">+$3,420</Heading>
          </Box>
        </SimpleGrid>

        {/* ===== DESKTOP TABLE ===== */}
        <Box
          bg="whiteAlpha.900"
          p={6}
          rounded="2xl"
          shadow="lg"
          display={{ base: "none", md: "block" }}
        >
          <Table>
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Details</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {historyData.map((item, i) => (
                <Tr key={i}>
                  <Td>{item.type}</Td>
                  <Td>{item.method}</Td>
                  <Td color={item.amount.startsWith("+") ? "green.500" : "red.500"}>
                    {item.amount}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        item.status === "Completed" || item.status === "Profit"
                          ? "green"
                          : "orange"
                      }
                    >
                      {item.status}
                    </Badge>
                  </Td>
                  <Td>{item.date}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* ===== MOBILE CARDS ===== */}
        <VStack spacing={4} display={{ base: "flex", md: "none" }}>
          {historyData.map((item, i) => (
            <Box key={i} bg="whiteAlpha.900" p={4} rounded="xl" w="100%">
              <HStack justify="space-between">
                <Text fontWeight="bold">{item.type}</Text>
                <Badge
                  colorScheme={
                    item.status === "Completed" || item.status === "Profit"
                      ? "green"
                      : "orange"
                  }
                >
                  {item.status}
                </Badge>
              </HStack>

              <Text fontSize="sm" mt={1}>{item.method}</Text>

              <HStack justify="space-between" mt={2}>
                <Text
                  fontWeight="bold"
                  color={item.amount.startsWith("+") ? "green.500" : "red.500"}
                >
                  {item.amount}
                </Text>
                <Text fontSize="xs">{item.date}</Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
}
