"use client";

import {
  Box,
  Stack,
  Heading,
  Text,
  Badge,
  Button,
  Flex,
  Image,
  VStack,
  HStack,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const MotionBox = motion(Box);

const stats = [
  { label: "Active Traders", value: 100000 },
  { label: "24/7 Support", value: 24 },
  { label: "Traded Volume ($B)", value: 1 },
  { label: "Countries Served", value: 120 },
];

const traders = [
  { name: "Alice Johnson", img: "/images/logo1.png", experience: 8, success: 92 },
  { name: "Mark Thompson", img: "/images/logo2.png", experience: 12, success: 88 },
  { name: "Sophia Lee", img: "/images/logo3.png", experience: 6, success: 95 },
  { name: "Daniel Kim", img: "/images/logo4.png", experience: 10, success: 90 },
  { name: "Emma Williams", img: "/images/logo5.png", experience: 7, success: 93 },
];

export default function TrustedSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    if (inView) {
      stats.forEach((stat, i) => {
        let start = 0;
        const end = stat.value;
        const duration = 1500;
        const increment = end / (duration / 30);

        const counter = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(counter);
          }
          setCounters(prev => {
            const newCounters = [...prev];
            newCounters[i] = Math.floor(start);
            return newCounters;
          });
        }, 30);
      });
    }
  }, [inView]);

  return (
    <Box position="relative" overflow="hidden" py={{ base: 20, md: 28 }}>
      {/* BACKGROUND VIDEO */}
      <Box
        as="video"
        src="/videos/trust-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        objectFit="cover"
        zIndex={-2}
      />

      {/* DARK OVERLAY */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bg="black"
        opacity={0.65}
        zIndex={-1}
      />

      <Stack maxW="1400px" mx="auto" px={{ base: 4, md: 12 }} spacing={16} textAlign="center" color="white">
        <Badge colorScheme="yellow" w="fit-content" mx="auto">
          Trusted By Traders
        </Badge>

        <Heading fontSize={{ base: "2xl", md: "4xl" }}>
          Millions of Traders Trust DbossFX Worldwide
        </Heading>

        <Text fontSize={{ base: "md", md: "lg" }}>
          Our professional trading environment, security, and fast execution make us the preferred choice.
        </Text>

        {/* Animated Stats */}
        <Flex justify="center" gap={{ base: 4, md: 12 }} flexWrap="wrap" ref={ref}>
          {stats.map((stat, i) => (
            <Box key={i} textAlign="center" minW="120px">
              <Heading fontSize={{ base: "2xl", md: "4xl" }} color="yellow.400">
                {counters[i]}
                {stat.label.includes("$B") ? "B+" : stat.label === "24/7 Support" ? "/7" : "+"}
              </Heading>
              <Text fontSize={{ base: "sm", md: "md" }}>
                {stat.label}
              </Text>
            </Box>
          ))}
        </Flex>

        {/* Traders Team */}
        <Box overflowX={{ base: "auto", md: "visible" }} py={4}>
          <HStack spacing={8} minW={{ base: "1000px", md: "100%" }} justify="center">
            {traders.map((trader, i) => (
              <MotionBox
                key={i}
                whileHover={{ y: -6, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                textAlign="center"
              >
                <Box position="relative" mx="auto" w={24} h={24}>
                  <Image
                    src={trader.img}
                    alt={trader.name}
                    borderRadius="full"
                    boxSize="100%"
                    objectFit="cover"
                  />
                  <Circle
                    size={4}
                    bg="green.400"
                    border="2px solid white"
                    position="absolute"
                    bottom={0}
                    right={0}
                  />
                </Box>
                <VStack spacing={1} mt={3}>
                  <Text fontWeight="bold">{trader.name}</Text>
                  <Text fontSize="sm" color="gray.200">
                    {trader.experience} yrs experience
                  </Text>
                  <Text fontSize="sm" color="gray.200">
                    Success Rate: {trader.success}%
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </HStack>
        </Box>

        {/* CTA */}
        <Button colorScheme="yellow" size="lg" mx="auto" mt={8} as="a" href="/open-account">
          Join Thousands of Traders
        </Button>
      </Stack>
    </Box>
  );
}
