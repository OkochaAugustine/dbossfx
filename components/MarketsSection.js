"use client";

import { Box, Heading, Text, SimpleGrid, Badge, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const markets = [
  {
    title: "Forex Trading",
    desc: "Trade major, minor, and exotic currency pairs with ultra-low spreads, advanced charts, and fast execution.",
    img: "/images/fx.jpg",
    color: "green.400",
  },
  {
    title: "Crypto Trading",
    desc: "Trade Bitcoin, Ethereum, and top altcoins with deep liquidity, real-time pricing, and secure wallets.",
    img: "/images/crypto.jpg",
    color: "yellow.400",
  },
  {
    title: "Stock Trading",
    desc: "Access global stocks from major exchanges with advanced analytics and investment insights.",
    img: "/images/stock.jpg",
    color: "blue.400",
  },
  {
    title: "Commodities",
    desc: "Trade gold, oil, and other commodities with smart risk management tools and real-time charts.",
    img: "/images/commodities.jpg",
    color: "orange.400",
  },
  {
    title: "Indices",
    desc: "Follow and trade major market indices, analyze trends, and diversify your portfolio globally.",
    img: "/images/indices.jpg",
    color: "pink.400",
  },
  {
    title: "Futures Trading",
    desc: "Speculate on future price movements of assets like commodities, currencies, and indices with leverage.",
    img: "/images/futures.jpg",
    color: "teal.400",
  },
];

export default function MarketsSection() {
  return (
    <Box py={{ base: 10, md: 24 }} px={{ base: 3, md: 12 }} bg="gray.50">
      <Heading
        textAlign="center"
        mb={{ base: 10, md: 16 }}
        fontSize={{ base: "2xl", md: "4xl" }}
      >
        Explore Our Trading Options
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        {markets.map((market, index) => (
          <MotionBox
            key={index}
            bg="white"
            borderRadius="xl"
            shadow="xl"
            overflow="hidden"
            cursor="pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Box
              bgImage={`url(${market.img})`}
              bgSize="cover"
              bgPosition="center"
              h={{ base: "180px", md: "240px" }}
            />

            <Box p={6}>
              <Flex mb={3}>
                <Badge colorScheme={market.color.split(".")[0]} px={3} py={1} fontSize="sm">
                  {market.title}
                </Badge>
              </Flex>

              <Heading fontSize={{ base: "lg", md: "2xl" }} mb={2}>
                {market.title}
              </Heading>

              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                {market.desc}
              </Text>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
}
