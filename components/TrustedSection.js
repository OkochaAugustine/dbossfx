"use client";

import {
  Box,
  Stack,
  Heading,
  Text,
  Badge,
  Flex,
  Image,
  VStack,
  HStack,
  Circle,
  Button,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

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
  const controls = useAnimation();

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

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" },
    });
  }, [controls]);

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

        {/* Mind-blowing CTA Button */}
        <MotionBox mt={12} animate={controls}>
          <MotionHeading
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="extrabold"
            mb={6}
            bgGradient="linear(to-l, yellow.400, whiteAlpha.900)"
            bgClip="text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Join Thousands of Successful Traders Today
          </MotionHeading>

          <MotionText
            fontSize={{ base: "md", md: "2xl" }}
            fontWeight="semibold"
            mb={6}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Experience ultra-fast execution, secure trading, and professional-grade tools to take your trading to the next level.
          </MotionText>

          <MotionButton
            size={{ base: "lg", md: "2xl" }}
            colorScheme="yellow"
            borderRadius="3xl"
            px={12}
            py={6}
            fontSize={{ base: "md", md: "xl" }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95, rotate: -2 }}
          >
            Start Trading Now
          </MotionButton>
        </MotionBox>
      </Stack>
    </Box>
  );
}

