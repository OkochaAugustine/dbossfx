"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Button,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionBox = motion(Box);

const paymentMethods = [
  {
    title: "Bank Transfer",
    desc: "Deposit via secure bank transfers with instant account funding.",
    img: "/images/bank.png",
  },
  {
    title: "Visa / Mastercard",
    desc: "Fund your account instantly with major credit cards.",
    img: "/images/card.png",
  },
  {
    title: "Cryptocurrency",
    desc: "Use Bitcoin, Ethereum, or other supported crypto coins to deposit.",
    img: "/images/crypto.png",
  },
  {
    title: "Fast Withdrawals",
    desc: "Withdraw your funds safely within 24 hours.",
    img: "/images/withdraw.png",
  },
];

export default function PaymentsSection() {
  return (
    <Box
      bgImage="url('/images/payments-bg.jpg')"
      bgSize="cover"
      bgPos="center"
      py={{ base: 20, md: 28 }}
      px={{ base: 4, md: 12 }}
    >
      <Stack
        maxW="1400px"
        mx="auto"
        spacing={14}
        color="white"
        textAlign="center"
      >
        {/* HEADER */}
        <Stack spacing={4}>
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Easy & Secure Payments
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.200">
            Deposit and withdraw funds quickly and securely with multiple
            options. Your money, always safe.
          </Text>
        </Stack>

        {/* PAYMENT METHODS GRID */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
          {paymentMethods.map((method, i) => (
            <MotionBox
              key={i}
              textAlign="center"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Box mx="auto" mb={4} w={16} h={16}>
                <Image
                  src={method.img}
                  alt={method.title}
                  width={64}
                  height={64}
                />
              </Box>

              <Heading fontSize="lg" mb={2}>
                {method.title}
              </Heading>

              <Text fontSize="sm" color="gray.200">
                {method.desc}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* CTA */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify="center"
          pt={10}
        >
          {/* FUND ACCOUNT → REGISTER */}
          <Link href="/register">
            <Button colorScheme="yellow" size="lg">
              Fund Account Now
            </Button>
          </Link>

          {/* TRY DEMO → METATRADER 5 */}
          <Link
            href="https://www.metatrader5.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              colorScheme="yellow"
              size="lg"
            >
              Try Demo
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
