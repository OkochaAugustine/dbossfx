"use client";

import { Box, Flex, Heading, Text, Button, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

const markets = [
  {
    title: "Forex Trading",
    desc: "Trade major, minor, and exotic currency pairs with ultra-low spreads.",
    img: "/images/fx.jpg",
    color: "green",
  },
  {
    title: "Crypto Trading",
    desc: "Trade Bitcoin, Ethereum, and top altcoins with deep liquidity.",
    img: "/images/crypto.jpg",
    color: "yellow",
  },
  {
    title: "Stock Trading",
    desc: "Trade global stocks with real-time pricing and advanced tools.",
    img: "/images/stock.jpg",
    color: "blue",
  },
];

export default function MarketsSection() {
  return (
    <Box py={{ base: 10, md: 24 }} px={{ base: 3, md: 12 }} bg="white">
      <Heading
        textAlign="center"
        mb={{ base: 10, md: 16 }}
        fontSize={{ base: "2xl", md: "4xl" }}
      >
        Global Markets at Your Fingertips
      </Heading>

      {markets.map((market, index) => (
        <Flex
          key={index}
          direction={index % 2 === 0 ? "row" : "row-reverse"}
          align="center"
          gap={{ base: 4, md: 16 }}
          mb={{ base: 14, md: 28 }}
          maxW="1400px"
          mx="auto"
        >
          {/* IMAGE */}
          <Box
            flex="1"
            w="50%"
            minH={{ base: "180px", md: "420px" }}
            bgImage={`url(${market.img})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center"
            borderRadius="xl"
            boxShadow="lg"
          />

          {/* TEXT */}
          <Stack flex="1" w="50%" spacing={{ base: 3, md: 6 }}>
            <MotionHeading
              fontSize={{ base: "lg", md: "3xl" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {market.title}
            </MotionHeading>

            <MotionText
              fontSize={{ base: "sm", md: "lg" }}
              color="gray.600"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {market.desc}
            </MotionText>

            {/* START TRADING → REGISTER */}
            <Link href="/register">
              <MotionButton
                size={{ base: "sm", md: "lg" }}
                colorScheme={market.color}
                w="fit-content"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Start Trading
              </MotionButton>
            </Link>
          </Stack>
        </Flex>
      ))}
    </Box>
  );
}
