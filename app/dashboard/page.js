"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  Stack,
  VStack,
  HStack,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Divider,
  SimpleGrid,
  useDisclosure,
  IconButton,
  Collapse,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

// Sample live market data
const marketData = [
  { pair: "EUR/USD", price: 1.1023, change: 0.12 },
  { pair: "USD/JPY", price: 144.21, change: -0.05 },
  { pair: "GBP/USD", price: 1.2589, change: 0.07 },
  { pair: "AUD/USD", price: 0.6854, change: -0.03 },
  { pair: "USD/CHF", price: 0.9145, change: 0.02 },
  { pair: "NZD/USD", price: 0.6321, change: 0.10 },
];

// Sample account summary
const accountSummary = {
  balance: 12500,
  equity: 12750,
  marginUsed: 2500,
  freeMargin: 10250,
  profit: 300,
  loss: 50,
};

// Sample news
const newsData = [
  { title: "ECB Keeps Rates Steady Amid Inflation Concerns", time: "2h ago" },
  { title: "Bitcoin Surges Past $35k Following ETF Approval", time: "4h ago" },
  { title: "US Non-Farm Payroll Exceeds Expectations", time: "6h ago" },
];

export default function DashboardPage() {
  const [prices, setPrices] = useState(marketData);
  const { isOpen, onToggle } = useDisclosure();
  const [muted, setMuted] = useState(false);
  const [showValues, setShowValues] = useState(true); // toggle for account visibility

  const toggleMute = () => setMuted(!muted);
  const toggleShowValues = () => setShowValues(!showValues);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((item) => ({
          ...item,
          price: (item.price * (1 + (Math.random() - 0.5) / 200)).toFixed(4),
          change: ((Math.random() - 0.5) / 2).toFixed(2),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatValue = (value) => (showValues ? `$${value.toLocaleString()}` : "*****");

  return (
    <Flex minH="100vh" bg="gray.50" direction={{ base: "column", md: "row" }}>
      {/* ===== SIDEBAR ===== */}
      <VStack
        w={{ base: "full", md: "250px" }}
        bg="url('/images/side-bg.png')"
        bgSize="cover"
        bgPos="center"
        p={6}
        spacing={6}
        align="stretch"
        boxShadow={{ base: "none", md: "md" }}
      >
        {/* Mobile Header */}
        <Flex justify="space-between" align="center" display={{ base: "flex", md: "none" }}>
          <Heading size="md" color="white">DbossFX</Heading>
          <IconButton
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            onClick={onToggle}
          />
        </Flex>

        <Collapse in={isOpen || { base: true, md: false }} animateOpacity>
          <VStack align="stretch" spacing={4} mt={{ base: 4, md: 0 }}>
            <Link href="/dashboard" passHref>
              <Button as="a" variant="ghost" justifyContent="flex-start" color="white">Dashboard</Button>
            </Link>
            <Link href="/trade" passHref>
              <Button as="a" variant="ghost" justifyContent="flex-start" color="white">Trade</Button>
            </Link>
            <Link href="/accounts" passHref>
              <Button as="a" variant="ghost" justifyContent="flex-start" color="white">Accounts</Button>
            </Link>
            <Link href="/history" passHref>
              <Button as="a" variant="ghost" justifyContent="flex-start" color="white">History</Button>
            </Link>
            <Link href="/settings" passHref>
              <Button as="a" variant="ghost" justifyContent="flex-start" color="white">Settings</Button>
            </Link>
            <Divider borderColor="whiteAlpha.500" />

            {/* Deposit / Withdraw */}
            <HStack spacing={2} wrap="wrap">
              <Link href="/deposit" passHref>
                <Button as="a" colorScheme="yellow" flex="1" minW="100px">Deposit</Button>
              </Link>
              <Link href="/withdraw" passHref>
                <Button as="a" colorScheme="yellow" variant="outline" flex="1" minW="100px">Withdraw</Button>
              </Link>
            </HStack>

            {/* Account Summary */}
            <VStack align="stretch" spacing={1}>
              <HStack justify="space-between">
                <Text fontWeight="bold" color="white">Balance</Text>
                <IconButton
                  aria-label="Toggle Visibility"
                  icon={showValues ? <ViewIcon /> : <ViewOffIcon />}
                  colorScheme="yellow"
                  size="sm"
                  onClick={toggleShowValues}
                />
              </HStack>
              <Text color="white">{formatValue(accountSummary.balance)}</Text>
              <Text fontWeight="bold" color="white">Profit</Text>
              <Text color="green.300">{formatValue(accountSummary.profit)}</Text>
              <Text fontWeight="bold" color="white">Loss</Text>
              <Text color="red.300">{formatValue(accountSummary.loss)}</Text>
            </VStack>

            {/* Mute Toggle */}
            <IconButton
              aria-label="Mute/Unmute"
              icon={muted ? <ViewOffIcon /> : <ViewIcon />}
              colorScheme="yellow"
              onClick={toggleMute}
            />
          </VStack>
        </Collapse>
      </VStack>

      {/* ===== MAIN CONTENT ===== */}
      <Box
        flex="1"
        p={6}
        bg="url('/images/dash-bg.png')"
        bgSize="cover"
        bgPos="center"
        minH="100vh"
      >
        {/* Top Ticker */}
        <HStack spacing={4} overflowX="auto" mb={6}>
          {prices.map((p, i) => (
            <Box
              key={i}
              p={2}
              bg={p.change >= 0 ? "green.50" : "red.50"}
              rounded="md"
              minW="120px"
              textAlign="center"
            >
              <Text fontWeight="bold">{p.pair}</Text>
              <Text>${p.price}</Text>
              <Text color={p.change >= 0 ? "green.500" : "red.500"}>{p.change}%</Text>
            </Box>
          ))}
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Left Column */}
          <VStack spacing={6} align="stretch">
            {/* TradingView Tickers */}
            <Box h="400px" bg="white" rounded="2xl" shadow="lg" overflow="hidden">
              <iframe
                src="https://s.tradingview.com/embed-widget/tickers/?locale=en"
                style={{ width: "100%", height: "100%", border: 0 }}
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </Box>

            {/* S&P 500 Live Chart */}
            <Box h="300px" bg="white" rounded="2xl" shadow="lg" overflow="hidden">
              <iframe
                src="https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbols=SPX%7CUS500"
                style={{ width: "100%", height: "100%", border: 0 }}
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </Box>

            {/* Market News */}
            <Box bg="white" p={4} rounded="2xl" shadow="lg">
              <Heading size="md" mb={4}>Market News</Heading>
              <VStack spacing={3} align="stretch">
                {newsData.map((news, i) => (
                  <Box key={i} bg="gray.50" p={3} rounded="md">
                    <Text fontWeight="bold">{news.title}</Text>
                    <Text fontSize="sm" color="gray.500">{news.time}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>

          {/* Right Column */}
          <VStack spacing={6} align="stretch">
            {/* Account Summary */}
            <Box bg="white" p={6} rounded="2xl" shadow="lg">
              <Heading size="md" mb={4}>Account Summary</Heading>
              <Stack spacing={3}>
                <HStack justify="space-between"><Text>Balance</Text><Text>{formatValue(accountSummary.balance)}</Text></HStack>
                <HStack justify="space-between"><Text>Equity</Text><Text>{formatValue(accountSummary.equity)}</Text></HStack>
                <HStack justify="space-between"><Text>Margin Used</Text><Text>{formatValue(accountSummary.marginUsed)}</Text></HStack>
                <HStack justify="space-between"><Text>Free Margin</Text><Text>{formatValue(accountSummary.freeMargin)}</Text></HStack>
                <HStack justify="space-between"><Text>Profit</Text><Text color="green.500">{formatValue(accountSummary.profit)}</Text></HStack>
                <HStack justify="space-between"><Text>Loss</Text><Text color="red.500">{formatValue(accountSummary.loss)}</Text></HStack>
              </Stack>
            </Box>

            {/* Top Pairs Table */}
            <Box bg="white" p={6} rounded="2xl" shadow="lg" overflowX="auto">
              <Heading size="md" mb={4}>Top Pairs</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Pair</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Change %</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {prices.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item.pair}</Td>
                      <Td isNumeric>{item.price}</Td>
                      <Td isNumeric color={item.change >= 0 ? "green.500" : "red.500"}>{item.change}%</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Quick Actions */}
            <HStack spacing={4} wrap="wrap">
              <Link href="/deposit" passHref>
                <Button as="a" colorScheme="yellow" flex="1" minW="120px">Deposit</Button>
              </Link>
              <Link href="/withdraw" passHref>
                <Button as="a" colorScheme="yellow" variant="outline" flex="1" minW="120px">Withdraw</Button>
              </Link>
            </HStack>
          </VStack>
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
