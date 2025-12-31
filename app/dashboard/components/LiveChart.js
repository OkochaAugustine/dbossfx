"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";


export default function LiveChart({ initialSymbol = "FX:EURUSD", height = 600, userId }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "1", // live updates
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      withdateranges: true,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: true,
      studies: [
        "RSI@tv-basicstudies",
        "Stochastic@tv-basicstudies",
        "BB@tv-basicstudies",
      ],
    });

    chartRef.current.appendChild(script);
  }, [symbol]);

  return (
    <Box w="100%">
      {/* Account Statement on top */}
      {userId && (
        <Box mb={4} w="100%">
          
        </Box>
      )}

      {/* TradingView Chart */}
      <Box
        ref={chartRef}
        w="100%"
        h={`${height}px`}
        borderRadius="xl"
        overflow="hidden"
        bg="white"
        _dark={{ bg: "gray.800" }}
      />
    </Box>
  );
}
