"use client";

import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Collapse,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();

  const [pairs, setPairs] = useState([
    "EUR/USD 1.1023 ▲0.12%",
    "USD/JPY 144.21 ▼0.05%",
    "GBP/USD 1.2589 ▲0.07%",
    "AUD/USD 0.6854 ▼0.03%",
    "USD/CHF 0.9145 ▲0.02%",
    "NZD/USD 0.6321 ▲0.10%",
  ]);

  // Rotate currency pairs for live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prev) => [...prev.slice(1), prev[0]]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const NavLink = ({ href, children }) => (
    <Link href={href ?? "#"} passHref legacyBehavior>
      <ChakraLink
        px={3}
        py={2}
        rounded="md"
        _hover={{ textDecoration: "none", bg: "gray.100" }}
        color="black"
      >
        {children}
      </ChakraLink>
    </Link>
  );

  return (
    <Box position="sticky" top="0" zIndex="1000" bg="white" boxShadow="md">
      {/* Top Row: Logo, Links, CTA */}
      <Flex
        h={20}
        alignItems="center"
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
        px={4}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <Image src="/images/logo.png" alt="DbossFX Logo" width={80} height={80} />
          <Text ml={3} fontSize="3xl" fontWeight="bold" color="black">
            DbossFX
          </Text>
        </Box>

        {/* Desktop Links */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/markets">Markets</NavLink>
          <NavLink href="/platforms">Platforms</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </HStack>

        {/* CTA Buttons */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <NavLink href="/login">
            <Button variant="outline" colorScheme="yellow">
              Login
            </Button>
          </NavLink>
          <NavLink href="/register">
            <Button colorScheme="yellow">Open Account</Button>
          </NavLink>
        </HStack>

        {/* Mobile Hamburger */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={onToggle}
          color="black"
          bg="transparent"
          _hover={{ bg: "gray.100" }}
        />
      </Flex>

      {/* Bottom Row: Live Currency Pairs */}
      <Box bg="gray.50" py={2} px={4} overflow="hidden">
        {/* Desktop Grid */}
        <Flex display={{ base: "none", md: "flex" }} gap={4}>
          {pairs.map((pair, i) => (
            <Text
              key={i}
              fontSize="sm"
              fontWeight="bold"
              color={pair.includes("▲") ? "green.500" : "red.500"}
            >
              {pair}
            </Text>
          ))}
        </Flex>

        {/* Mobile Horizontal Scroll */}
        <Flex display={{ base: "flex", md: "none" }} overflowX="auto" gap={4}>
          {pairs.map((pair, i) => (
            <Text
              key={i}
              flex="0 0 auto"
              fontSize="sm"
              fontWeight="bold"
              color={pair.includes("▲") ? "green.500" : "red.500"}
              px={3}
              py={1}
              bg="gray.100"
              rounded="md"
            >
              {pair}
            </Text>
          ))}
        </Flex>
      </Box>

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box pb={4} display={{ md: "none" }} bg="white">
          <Stack as="nav" spacing={4}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/markets">Markets</NavLink>
            <NavLink href="/platforms">Platforms</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/register">
              <Button colorScheme="yellow" w="full">
                Open Account
              </Button>
            </NavLink>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
