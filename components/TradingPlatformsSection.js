"use client";

import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionBox = motion(Box);

const platforms = [
  {
    name: "MetaTrader 4",
    image: "/images/mt4.jpg",
    demoUrl: "https://www.mql5.com/en/trading-platforms/metatrader4",
  },
  {
    name: "MetaTrader 5",
    image: "/images/mt5.jpg",
    demoUrl: "https://www.mql5.com/en/trading-platforms/metatrader5",
  },
  {
    name: "TradingView",
    image: "/images/tradingview.jpg",
    demoUrl: "https://www.tradingview.com/",
  },
];

export default function TradingPlatformsSection() {
  return (
    <Box bg="gray.50" py={{ base: 20, md: 28 }} px={{ base: 4, md: 12 }}>
      <Stack spacing={12} maxW="1400px" mx="auto">
        {/* HEADER */}
        <Stack spacing={4} textAlign="center">
          <Badge colorScheme="yellow" w="fit-content" mx="auto">
            Trading Platforms
          </Badge>

          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Trade on World-Class Platforms
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Access the global markets using industry-leading platforms
            trusted by millions of traders worldwide.
          </Text>
        </Stack>

        {/* PLATFORMS GRID */}
        <SimpleGrid
          columns={{ base: 3, md: 3 }}
          spacing={{ base: 4, md: 8 }}
        >
          {platforms.map((platform, i) => (
            <MotionBox
              key={i}
              bg="white"
              rounded="2xl"
              overflow="hidden"
              shadow="xl"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {/* IMAGE */}
              <Box position="relative" h={{ base: "140px", md: "220px" }}>
                <Image
                  src={platform.image}
                  alt={platform.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>

              {/* CONTENT */}
              <Stack spacing={4} p={{ base: 4, md: 6 }} textAlign="center">
                <Heading fontSize={{ base: "md", md: "xl" }}>
                  {platform.name}
                </Heading>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={3}
                  justify="center"
                >
                  {/* DEMO → EXTERNAL */}
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    as="a"
                    href={platform.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demo
                  </Button>

                  {/* OPEN LIVE → REGISTER */}
                  <Link href="/register">
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="yellow"
                    >
                      Open Live
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
