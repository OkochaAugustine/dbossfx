"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Badge,
  Divider,
  Icon,
  Button,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LockIcon, CheckCircleIcon, InfoOutlineIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

const securityFeatures = [
  {
    title: "Segregated Client Funds",
    desc: "Client funds are held separately from company capital to ensure maximum protection.",
    icon: CheckCircleIcon,
  },
  {
    title: "Advanced Data Encryption",
    desc: "All trading and personal data is protected using industry-standard SSL encryption.",
    icon: LockIcon,
  },
  {
    title: "Secure Trading Infrastructure",
    desc: "Our systems operate in high-availability environments with enterprise-grade reliability.",
    icon: InfoOutlineIcon,
  },
  {
    title: "Risk Management Controls",
    desc: "Negative balance protection and real-time risk monitoring safeguard your account.",
    icon: CheckCircleIcon,
  },
];

const paymentMethods = [
  {
    title: "Bank Transfer",
    desc: "Deposit via secure bank transfers with instant account funding.",
    img: "/images/bank-logo.jpg",
  },
  {
    title: "Visa / Mastercard",
    desc: "Fund your account instantly with major credit cards.",
    img: "/images/card.jpg",
  },
  {
    title: "Cryptocurrency",
    desc: "Use Bitcoin, Ethereum, or other supported crypto coins to deposit.",
    img: "/images/crypto.png",
  },
  {
    title: "Fast Withdrawals",
    desc: "Withdraw your funds safely within 24 hours.",
    img: "/images/withdra.png",
  },
];

export default function SecuritySection() {
  return (
    <Box position="relative" overflow="hidden" py={{ base: 20, md: 28 }}>
      {/* BACKGROUND VIDEO */}
      <Box
        as="video"
        src="/videos/security.mp4"
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

      {/* CONTENT */}
      <Stack
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 12 }}
        spacing={20}
        color="white"
      >
        {/* SECURITY HEADER */}
        <Stack textAlign="center" spacing={4}>
          <Badge colorScheme="yellow" w="fit-content" mx="auto">
            Security & Protection
          </Badge>

          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Your Funds. Protected. Always.
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.200">
            DbossFX operates with institutional-grade security, transparency,
            and infrastructure designed to protect every trader.
          </Text>
        </Stack>

        {/* SECURITY FEATURES GRID */}
        <Divider borderColor="whiteAlpha.300" />
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
          {securityFeatures.map((item, i) => (
            <MotionBox
              key={i}
              textAlign="center"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                mx="auto"
                mb={4}
                w={{ base: 14, md: 16 }}
                h={{ base: 14, md: 16 }}
                rounded="full"
                bg="yellow.400"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={item.icon} boxSize={{ base: 6, md: 7 }} color="black" />
              </Box>

              <Heading fontSize={{ base: "md", md: "lg" }} mb={2}>
                {item.title}
              </Heading>

              <Text fontSize="sm" color="gray.300">
                {item.desc}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* PAYMENTS & WITHDRAWALS HEADER */}
        <Stack textAlign="center" spacing={4} pt={12}>
          <Badge colorScheme="yellow" w="fit-content" mx="auto">
            Payments & Withdrawals
          </Badge>

          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Fast, Safe & Flexible Funding
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.200">
            Deposit and withdraw funds quickly and securely with multiple options.
            Your money, always safe.
          </Text>
        </Stack>

        {/* PAYMENTS GRID */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
          {paymentMethods.map((method, i) => (
            <MotionBox
              key={i}
              textAlign="center"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                mx="auto"
                mb={4}
                w={{ base: 20, md: 24 }}
                h={{ base: 20, md: 24 }}
              >
                <Image
                  src={method.img}
                  alt={method.title}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                />
              </Box>

              <Heading fontSize={{ base: "md", md: "lg" }} mb={2}>
                {method.title}
              </Heading>

              <Text fontSize="sm" color="gray.200">
                {method.desc}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* CTA BUTTONS */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify="center"
          pt={10}
        >
          <Button colorScheme="yellow" size="lg" as="a" href="/open-account">
            Fund Account Now
          </Button>
          <Button
            variant="outline"
            colorScheme="yellow"
            size="lg"
            as="a"
            href="/demo-account"
          >
            Try Demo
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
