"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  Select,
  Stack,
  Divider,
  IconButton,
  Collapse,
  SimpleGrid,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation"; // For page navigation

// Sample account data
const initialAccount = {
  balance: 15000,
  profit: 2500,
  loss: 800,
  equity: 16700,
};

// Sample live market data
const marketData = [
  { pair: "EUR/USD", price: 1.1023, change: 0.12 },
  { pair: "BTC/USD", price: 27980, change: 1.25 },
  { pair: "AAPL", price: 178.3, change: -0.45 },
  { pair: "ETH/USD", price: 1850, change: 0.75 },
  { pair: "USD/JPY", price: 144.21, change: -0.05 },
];

// Sample news
const newsData = [
  { title: "ECB Keeps Rates Steady Amid Inflation Concerns", time: "2h ago" },
  { title: "Bitcoin Surges Past $35k Following ETF Approval", time: "4h ago" },
  { title: "US Non-Farm Payroll Exceeds Expectations", time: "6h ago" },
];

// Complete tradable assets: FX, Crypto, Stocks
const tradableAssets = [
  "EUR/USD", "USD/JPY", "GBP/USD", "AUD/USD", "USD/CHF", "NZD/USD",
  "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "USD/CAD",
  "BTC/USD", "ETH/USD", "XRP/USD", "LTC/USD", "ADA/USD", "SOL/USD",
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NFLX", "META", "NVDA"
];

export default function TradeDashboard() {
  const router = useRouter();
  const [account, setAccount] = useState(initialAccount);
  const [prices, setPrices] = useState(marketData);
  const [showValues, setShowValues] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [manualTrade, setManualTrade] = useState({
    pair: "EUR/USD",
    type: "Buy",
    amount: "",
  });
  const [botTrading, setBotTrading] = useState([]);
  const [mining, setMining] = useState({ active: false, mined: 0 });
  const [search, setSearch] = useState("");

  const filteredAssets = tradableAssets.filter(asset =>
    asset.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((item) => ({
          ...item,
          price: (item.price * (1 + (Math.random() - 0.5) / 100)).toFixed(2),
          change: ((Math.random() - 0.5) / 2).toFixed(2),
        }))
      );

      setBotTrading((prev) => [
        ...prev,
        {
          pair: ["BTC/USD", "EUR/USD", "AAPL"][Math.floor(Math.random() * 3)],
          type: Math.random() > 0.5 ? "Buy" : "Sell",
          amount: (Math.random() * 500).toFixed(2),
          profit: (Math.random() * 50 - 25).toFixed(2),
        },
      ]);

      if (mining.active) {
        setMining((prev) => ({ ...prev, mined: (prev.mined + Math.random()).toFixed(2) }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [mining.active]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleValues = () => setShowValues(!showValues);

  const handleManualTradeChange = (e) => {
    const { name, value } = e.target;
    setManualTrade((prev) => ({ ...prev, [name]: value }));
  };

  const executeTrade = () => {
    alert(`Executed ${manualTrade.type} trade for ${manualTrade.pair}, amount: ${manualTrade.amount}`);
    setManualTrade({ ...manualTrade, amount: "" });
  };

  const toggleMining = () => setMining((prev) => ({ ...prev, active: !prev.active }));

  // Navigation handler for sidebar buttons
  const navigateTo = (page) => {
    router.push(`/${page.toLowerCase()}`);
  };

  return (
    <Flex minH="100vh" bg="gray.50" direction={{ base: "column", md: "row" }}>
      {/* ===== SIDEBAR ===== */}
      <VStack
        w={{ base: "full", md: "250px" }}
        p={6}
        spacing={6}
        align="stretch"
        bgImage="url('/images/side-bg.png')"
        bgSize="cover"
        boxShadow={{ base: "none", md: "md" }}
      >
        <Flex justify="space-between" align="center" display={{ base: "flex", md: "none" }}>
          <Heading size="md" color="white">DbossFX</Heading>
          <IconButton
            icon={isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            onClick={toggleSidebar}
          />
        </Flex>

        <Collapse in={isSidebarOpen || { base: true, md: false }} animateOpacity>
          <VStack align="stretch" spacing={4} mt={{ base: 4, md: 0 }}>
            {["Dashboard", "Trade", "Accounts", "History", "Settings"].map((item, i) => (
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
            <HStack spacing={2}>
              <Button colorScheme="yellow" flex="1" onClick={() => navigateTo("deposit")}>Deposit</Button>
              <Button colorScheme="yellow" variant="outline" flex="1" onClick={() => navigateTo("withdraw")}>Withdraw</Button>
            </HStack>
            <VStack align="stretch" spacing={1}>
              <Text fontWeight="bold" color="white">Account Balance</Text>
              <Text color="white">
                {showValues
                  ? `$${account.balance.toLocaleString()} (P: $${account.profit}, L: $${account.loss})`
                  : "****"}
              </Text>
              <IconButton
                aria-label="Toggle Balance Visibility"
                icon={showValues ? <ViewIcon /> : <ViewOffIcon />}
                size="sm"
                onClick={toggleValues}
                colorScheme="yellow"
              />
            </VStack>
          </VStack>
        </Collapse>
      </VStack>

      {/* ===== MAIN CONTENT ===== */}
      <Box flex="1" p={6} bgImage="url('/images/dash-bg.png')" bgSize="cover">
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
          {/* ===== Manual Trade Section ===== */}
          <VStack bg="white" p={6} rounded="2xl" shadow="lg" spacing={4} align="stretch">
            <Heading size="md">Manual Trade</Heading>
            <Input
              placeholder="Search asset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select name="pair" value={manualTrade.pair} onChange={handleManualTradeChange}>
              {filteredAssets.map((asset, i) => (
                <option key={i} value={asset}>{asset}</option>
              ))}
            </Select>
            <Select name="type" value={manualTrade.type} onChange={handleManualTradeChange}>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </Select>
            <Input
              placeholder="Amount"
              name="amount"
              value={manualTrade.amount}
              onChange={handleManualTradeChange}
            />
            <Button colorScheme="yellow" onClick={executeTrade}>
              Execute Trade
            </Button>
          </VStack>

          {/* ===== Bot Trading Section ===== */}
          <VStack bg="white" p={6} rounded="2xl" shadow="lg" spacing={4} align="stretch">
            <Heading size="md">Automated Bot Trading</Heading>
            <Box maxH="300px" overflowY="auto">
              {botTrading.slice(-10).reverse().map((trade, i) => (
                <Box
                  key={i}
                  bg={trade.profit >= 0 ? "green.50" : "red.50"}
                  p={2}
                  rounded="md"
                  mb={2}
                >
                  <Text fontWeight="bold">
                    {trade.type} {trade.pair} - Amount: ${trade.amount}
                  </Text>
                  <Text color={trade.profit >= 0 ? "green.500" : "red.500"}>
                    Profit/Loss: ${trade.profit}
                  </Text>
                </Box>
              ))}
            </Box>
          </VStack>
        </SimpleGrid>

        {/* ===== Crypto Mining Section ===== */}
        <VStack mt={6} bg="white" p={6} rounded="2xl" shadow="lg" spacing={4} align="stretch">
          <Heading size="md">Crypto Mining</Heading>
          <Text>Start mining BTC and watch your earnings grow:</Text>
          <Button colorScheme={mining.active ? "red" : "yellow"} onClick={toggleMining}>
            {mining.active ? "Stop Mining" : "Start Mining"}
          </Button>
          <Text>Coins Mined: {mining.mined}</Text>
        </VStack>

        {/* ===== Market News Section ===== */}
        <VStack mt={6} bg="white" p={6} rounded="2xl" shadow="lg" spacing={3} align="stretch">
          <Heading size="md">Market News</Heading>
          {newsData.map((news, i) => (
            <Box key={i} bg="gray.50" p={3} rounded="md">
              <Text fontWeight="bold">{news.title}</Text>
              <Text fontSize="sm" color="gray.500">{news.time}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
}
