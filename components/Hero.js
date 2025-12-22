"use client";

import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Badge,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Hero slides with unique text for each
const heroSlides = [
  {
    img: "/images/hero.jpg",
    heading: "Trade the Global Markets",
    highlight: "Like a Boss",
    subtext: "Ultra-low spreads, fast execution, and powerful trading platforms you can trust.",
  },
  {
    img: "/images/hero2.jpg",
    heading: "Your Gateway to Forex",
    highlight: "Unlimited Potential",
    subtext: "Seamlessly access major currency pairs and CFDs with professional tools.",
  },
  {
    img: "/images/hero3.jpg",
    heading: "Smart Trading Starts Here",
    highlight: "Trade Confidently",
    subtext: "Leverage advanced analytics and lightning-fast execution to maximize profits.",
  },
  {
    img: "/images/hero4.jpg",
    heading: "Global Markets at Your Fingertips",
    highlight: "Anytime, Anywhere",
    subtext: "Trade currencies and commodities on the go with our sleek platform.",
  },
];

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const headingVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1 } },
    exit: { opacity: 0, y: -50, scale: 0.8, transition: { duration: 0.8 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.8 } },
  };

  return (
    <Box w="full" overflow="hidden" position="relative" minH="90vh">
      {heroSlides.map((slide, index) => (
        <Box
          key={index}
          position={index === current ? "relative" : "absolute"}
          top="0"
          left="0"
          w="full"
          minH="90vh"
          opacity={index === current ? 1 : 0}
        >
          <Image
            src={slide.img}
            alt={`Hero ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />

          <Flex
            position="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            bg="rgba(0,0,0,0.5)"
            align="center"
            justify="center"
            direction="column"
            color="white"
            textAlign="center"
            px={6}
          >
            <Badge colorScheme="yellow" px={3} py={1} fontSize="sm">
              Global Forex & CFD Broker
            </Badge>

            <AnimatePresence mode="wait">
              {index === current && (
                <>
                  <MotionHeading
                    variants={headingVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    fontSize={{ base: "3xl", md: "6xl" }}
                    mt={4}
                  >
                    {slide.heading}{" "}
                    <Text as="span" color="yellow.400">
                      {slide.highlight}
                    </Text>
                  </MotionHeading>

                  <MotionText
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    fontSize={{ base: "md", md: "lg" }}
                    color="gray.200"
                    mt={4}
                    maxW="600px"
                  >
                    {slide.subtext}
                  </MotionText>

                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing={4}
                    justify="center"
                    mt={6}
                  >
                    {/* OPEN ACCOUNT → REGISTER */}
                    <Link href="/register">
                      <MotionButton
                        variants={buttonVariants}
                        size="lg"
                        colorScheme="yellow"
                      >
                        Open Free Account
                      </MotionButton>
                    </Link>

                    {/* TRY DEMO → METATRADER 5 */}
                    <Link
                      href="https://www.metatrader5.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MotionButton
                        variants={buttonVariants}
                        size="lg"
                        variant="outline"
                        colorScheme="yellow"
                      >
                        Try Demo
                      </MotionButton>
                    </Link>
                  </Stack>
                </>
              )}
            </AnimatePresence>
          </Flex>
        </Box>
      ))}
    </Box>
  );
}
