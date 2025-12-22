"use client";

import {
  Box,
  SimpleGrid,
  Heading,
  Select,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// ---------------- MINI CHART ----------------
function MiniChart({ symbol, onClick, theme }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "1D",
      colorTheme: theme,
      isTransparent: false,
    });

    ref.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <Box
      ref={ref}
      h="180px"
      cursor="pointer"
      _hover={{ transform: "scale(1.03)" }}
      transition="0.3s"
      onClick={onClick}
    />
  );
}

// ---------------- FULL CHART MODAL ----------------
function FullChart({ symbol, theme }) {
  return (
    <iframe
      src={`https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=15&theme=${theme}`}
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen
    />
  );
}

// ---------------- MAIN COMPONENT ----------------
export default function LiveChartsPro() {
  const [theme, setTheme] = useState("light");
  const [symbol, setSymbol] = useState("FX:EURUSD");
  const [tab, setTab] = useState("forex");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const symbols = {
    forex: ["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY", "FX:AUDUSD"],
    crypto: ["CRYPTO:BTCUSD", "CRYPTO:ETHUSD", "CRYPTO:SOLUSD"],
    indices: ["OANDA:SPX500USD", "OANDA:NAS100USD", "OANDA:DJIUSD"],
  };

  // 🔁 Auto-rotate charts
  useEffect(() => {
    const list = symbols[tab];
    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % list.length;
      setSymbol(list[i]);
    }, 6000);

    return () => clearInterval(interval);
  }, [tab]);

  return (
    <Box bg="white" p={6} rounded="2xl" shadow="lg">
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Heading size="lg">Live Market Charts</Heading>

        <Flex gap={3}>
          <Select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {symbols[tab].map((s) => (
              <option key={s} value={s}>
                {s.replace("FX:", "").replace("CRYPTO:", "")}
              </option>
            ))}
          </Select>

          <Button
            variant="outline"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "Dark" : "Light"}
          </Button>
        </Flex>
      </Flex>

      {/* Tabs */}
      <Tabs onChange={(i) => setTab(["forex", "crypto", "indices"][i])}>
        <TabList>
          <Tab>Forex</Tab>
          <Tab>Crypto</Tab>
          <Tab>Indices</Tab>
        </TabList>
      </Tabs>

      {/* Mini Charts */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
        {symbols[tab].map((s) => (
          <MiniChart
            key={s}
            symbol={s}
            theme={theme}
            onClick={() => {
              setSymbol(s);
              onOpen();
            }}
          />
        ))}
      </SimpleGrid>

      {/* Full Chart Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent h="80vh">
          <ModalCloseButton />
          <FullChart symbol={symbol} theme={theme} />
        </ModalContent>
      </Modal>
    </Box>
  );
}
