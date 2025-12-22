"use client";

import Hero from "@/components/Hero";
import MarketsSection from "@/components/MarketsSection";
import BrokerEdgeSection from "@/components/BrokerEdgeSection";
import WhyChooseDbossFX from "@/components/WhyChooseDbossFX";
import TradingPlatformsSection from "@/components/TradingPlatformsSection";
import AccountTypesSection from "@/components/AccountTypesSection";
import SecuritySection from "@/components/SecuritySection";
import TrustedSection from "@/components/TrustedSection";

import { Box, Heading, Text, Stack, SimpleGrid, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />

      <MarketsSection />
      <BrokerEdgeSection />
      <WhyChooseDbossFX />
      <TradingPlatformsSection />
      <AccountTypesSection />
      <SecuritySection />
      <TrustedSection />

      {/* FEATURES / TRUST SECTION */}
      <Box py={20} px={6} bg="gray.50">
        <Heading textAlign="center" mb={12}>
          Why Traders Choose DbossFX
        </Heading>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={8}
          maxW="1200px"
          mx="auto"
        >
          {[
            { title: "Ultra-Low Spreads", desc: "Trade major FX pairs with institutional-grade pricing." },
            { title: "Lightning Execution", desc: "Orders executed in milliseconds with zero requotes." },
            { title: "Secure Funds", desc: "Advanced security and segregated client accounts." },
            { title: "24/7 Support", desc: "Professional support team always ready to assist." },
          ].map((item, i) => (
            <Box key={i} bg="white" p={8} rounded="2xl" shadow="lg">
              <Heading fontSize="xl" mb={3}>{item.title}</Heading>
              <Text color="gray.600">{item.desc}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* CALL TO ACTION */}
      <Box bg="black" color="white" py={20} textAlign="center">
        <Stack spacing={6}>
          <Heading>Start Trading with Confidence</Heading>
          <Text color="gray.400">
            Join thousands of traders who trust DbossFX every day.
          </Text>

          <Link href="/register">
            <Button size="lg" colorScheme="yellow" mx="auto">
              Create Account Now
            </Button>
          </Link>
        </Stack>
      </Box>
    </>
  );
}
