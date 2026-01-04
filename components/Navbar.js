"use client";

import {
  Box,
  Flex,
  Text,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Collapse,
  Link as ChakraLink,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/components/context/LoadingContext";

/* FALLBACK ASSETS & NEWS */
const FALLBACK_ASSETS = [
  { symbol: "EURUSD", price: "1.0842", up: true },
  { symbol: "GBPUSD", price: "1.2631", up: false },
  { symbol: "USDJPY", price: "157.42", up: true },
  { symbol: "AUDUSD", price: "0.6521", up: true },
  { symbol: "USDCAD", price: "1.3724", up: false },
  { symbol: "BTC", price: "43210", up: true },
  { symbol: "ETH", price: "2280", up: false },
  { symbol: "AAPL", price: "195.30", up: true },
  { symbol: "TSLA", price: "248.12", up: false },
];

const FALLBACK_NEWS = [
  "ECB Keeps Rates Steady Amid Inflation Concerns",
  "Bitcoin Surges Past $35k Following ETF Approval",
  "US Non-Farm Payroll Exceeds Expectations",
  "Gold Prices Hit 6-Month High",
  "Tesla Announces New Model Release",
];

export default function Navbar() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const { setLoading, setType } = useLoading();

  const [assets, setAssets] = useState(FALLBACK_ASSETS);
  const [news, setNews] = useState(FALLBACK_NEWS);

  const go = (path) => {
    setType("public");
    setLoading(true);
    setTimeout(() => {
      router.replace(path);
    }, 50);
  };

  // Updated NavLink: closes mobile menu automatically when clicked
  const NavLink = ({ href, children }) => (
    <ChakraLink
      px={3}
      py={2}
      rounded="md"
      cursor="pointer"
      color="white"
      _hover={{ bg: "rgba(255,255,255,0.15)", textDecoration: "none" }}
      onClick={() => {
        if (isOpen) onClose(); // ✅ close mobile menu immediately
        go(href);
      }}
    >
      {children}
    </ChakraLink>
  );

  useEffect(() => {
    let mounted = true;

    const fetchMarket = async () => {
      try {
        const res = await fetch("/api/market", { cache: "no-store" });
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length > 0) setAssets(data);
      } catch (err) {
        console.error("Market API error:", err);
      }
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const assetsDuration = useMemo(() => `${Math.max(20, assets.length * 2)}s`, [assets.length]);
  const newsDuration = useMemo(() => `${Math.max(20, news.length * 2)}s`, [news.length]);

  return (
    <Box position="sticky" top="0" zIndex="1000">
      <Box bg="gray.900" boxShadow="md">
        <Flex
          h={20}
          maxW="7xl"
          mx="auto"
          px={4}
          align="center"
          justify="space-between"
        >
          <Box cursor="pointer" onClick={() => go("/")}>
            <Image src="/images/logo.png" alt="Logo" width={100} height={40} />
          </Box>

          {/* Desktop Links */}
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/markets">Markets</NavLink>
            <NavLink href="/platforms">Platforms</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Button
              colorScheme="yellow"
              onClick={() => go("/login")}
              size="sm"
            >
              Login
            </Button>
          </HStack>

          {/* Mobile menu toggle */}
          <IconButton
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            display={{ md: "none" }}
            onClick={onToggle}
            bg="transparent"
            color="white"
            aria-label="Toggle Menu"
          />
        </Flex>

        {/* Assets ticker */}
        <Box bg="gray.900" overflow="hidden" py={2}>
          <Flex w="max-content" animation={`ticker ${assetsDuration} linear infinite`}>
            <Flex gap={10} whiteSpace="nowrap">
              {assets.map((a, i) => (
                <Text
                  key={`a-${i}`}
                  fontSize="sm"
                  fontWeight="bold"
                  color={a.up ? "green.300" : "red.300"}
                >
                  {a.symbol} {a.price} {a.up ? "▲" : "▼"}
                </Text>
              ))}
            </Flex>
            <Flex gap={10} whiteSpace="nowrap">
              {assets.map((a, i) => (
                <Text
                  key={`b-${i}`}
                  fontSize="sm"
                  fontWeight="bold"
                  color={a.up ? "green.300" : "red.300"}
                >
                  {a.symbol} {a.price} {a.up ? "▲" : "▼"}
                </Text>
              ))}
            </Flex>
          </Flex>
        </Box>

        {/* News ticker */}
        <Box bg="gray.800" overflow="hidden" py={2}>
          <Flex w="max-content" animation={`ticker ${newsDuration} linear infinite`}>
            <Flex gap={10} whiteSpace="nowrap">
              {news.map((n, i) => (
                <Text key={`n-${i}`} fontSize="sm" color="yellow.300" fontWeight="medium">
                  📰 {n}
                </Text>
              ))}
            </Flex>
            <Flex gap={10} whiteSpace="nowrap">
              {news.map((n, i) => (
                <Text key={`m-${i}`} fontSize="sm" color="yellow.300" fontWeight="medium">
                  📰 {n}
                </Text>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* Mobile menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box bg="gray.900" pb={4} display={{ md: "none" }}>
          <Stack px={4} spacing={3}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/markets">Markets</NavLink>
            <NavLink href="/platforms">Platforms</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Button
              colorScheme="yellow"
              onClick={() => {
                onClose(); // ✅ close mobile menu immediately
                go("/login");
              }}
              w="full"
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Collapse>

      <style jsx global>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </Box>
  );
}
