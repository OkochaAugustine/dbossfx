"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// Example using TraderMade API for live Forex
const API_KEY = "YOUR_TRADERMADE_API_KEY";

export default function DashboardTickerHeader() {
  const [assets, setAssets] = useState([]);

  const fetchLiveForex = async () => {
    try {
      const res = await fetch(
        `https://api.tradermade.com/api/v1/live?currency=EURUSD,GBPUSD,USDJPY,USDCHF,AUDUSD,NZDUSD&api_key=${API_KEY}`
      );
      const data = await res.json();

      if (data && data.quotes) {
        const pairs = data.quotes.map((q) => {
          const change = q.bid - q.mid; // simple delta
          return {
            symbol: q.symbol,
            price: q.bid.toFixed(4),
            up: change >= 0,
          };
        });
        setAssets(pairs);
      }
    } catch (err) {
      console.error("Failed to fetch Forex data:", err);
    }
  };

  useEffect(() => {
    fetchLiveForex();
    const interval = setInterval(fetchLiveForex, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Rotate assets horizontally for ticker effect
  const [rotatedAssets, setRotatedAssets] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (assets.length > 0) setRotatedAssets((prev) => [...assets.slice(1), assets[0]]);
    }, 2000);
    return () => clearInterval(interval);
  }, [assets]);

  return (
    <Box bg="black" py={2} px={4} overflow="hidden">
      <Flex gap={6} overflowX="auto" whiteSpace="nowrap">
        {rotatedAssets.map((asset, i) => (
          <Text
            key={i}
            fontSize="sm"
            fontWeight="bold"
            color={asset.up ? "green.300" : "red.300"}
          >
            {asset.symbol} {asset.price} {asset.up ? "▲" : "▼"}
          </Text>
        ))}
      </Flex>
    </Box>
  );
}
