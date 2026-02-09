"use client";

import {
  Box,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  Icon,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { FaRobot, FaShieldAlt, FaBolt, FaChartLine, FaMobileAlt, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

export default function BotTradingPage() {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* ================= HERO ================= */}
      <Box
        bgGradient="linear(to-r, black, gray.800)"
        color="white"
        py={{ base: 20, md: 28 }}
        px={4}
      >
        <Stack spacing={6} maxW="1200px" mx="auto" textAlign="center">
          <Badge colorScheme="yellow" mx="auto">
            Bot Trading
          </Badge>

          <MotionHeading
            fontSize={{ base: "3xl", md: "5xl" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Let Our Smart Bot Trade For You
          </MotionHeading>

          <MotionText
            fontSize={{ base: "md", md: "lg" }}
            color="gray.300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Our automated trading bot executes trades 24/7 with unmatched accuracy, minimizing human errors and maximizing profit potential.
          </MotionText>

          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link href="/register" passHref>
              <Button
                size="lg"
                colorScheme="yellow"
                px={12}
                py={6}
                fontSize="xl"
              >
                Open Free Account
              </Button>
            </Link>
          </MotionBox>
        </Stack>
      </Box>

      {/* ================= BOT ADVANTAGES ================= */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <Stack maxW="1300px" mx="auto" spacing={16}>
          <Stack textAlign="center" spacing={4}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
              Why Choose Bot Trading?
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              Automated trading eliminates emotional decisions, executes instantly, and works 24/7 to seize every market opportunity.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {[
              {
                icon: FaBolt,
                title: "Ultra-Fast Execution",
                desc: "Bots react instantly to market changes, faster than any human could.",
              },
              {
                icon: FaShieldAlt,
                title: "Reduced Risk",
                desc: "Minimize human errors and emotional trading decisions for safer profits.",
              },
              {
                icon: FaChartLine,
                title: "Data-Driven Decisions",
                desc: "Advanced algorithms analyze trends and market signals for precision trading.",
              },
            ].map((f, i) => (
              <MotionBox
                key={i}
                whileHover={{ y: -6, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                bg="white"
                p={8}
                rounded="2xl"
                shadow="lg"
                textAlign="center"
              >
                <Icon as={f.icon} boxSize={12} color="yellow.400" mb={4} />
                <Heading size="md" mb={2}>{f.title}</Heading>
                <Text color="gray.600">{f.desc}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>

      {/* ================= HOW IT WORKS ================= */}
      <Box bg="white" py={{ base: 16, md: 24 }} px={4}>
        <Stack maxW="1300px" mx="auto" spacing={16}>
          <Stack textAlign="center" spacing={4}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
              How Our Bot Works
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              Our bot uses cutting-edge algorithms and AI to execute trades efficiently, monitor market conditions, and adapt strategies automatically.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {[{
                icon: FaRobot,
                title: "Automated Trading",
                desc: "The bot scans markets and trades without manual input.",
              },
              {
                icon: FaMobileAlt,
                title: "24/7 Monitoring",
                desc: "Always active, ensuring no opportunity is missed.",
              },
              {
                icon: FaGlobe,
                title: "Global Market Access",
                desc: "Trades across Forex, Crypto, and Stock markets seamlessly.",
              },
            ].map((item, i) => (
              <MotionBox
                key={i}
                whileHover={{ y: -6, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                bg="gray.50"
                p={8}
                rounded="2xl"
                shadow="md"
                textAlign="center"
              >
                <Icon as={item.icon} boxSize={12} color="yellow.400" mb={4} />
                <Heading size="md" mb={2}>{item.title}</Heading>
                <Text color="gray.600">{item.desc}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>

      {/* ================= CTA ================= */}
      <Box
        bgGradient="linear(to-r, black, gray.800)"
        color="white"
        py={{ base: 20, md: 28 }}
        px={4}
      >
        <Stack maxW="1200px" mx="auto" spacing={6} textAlign="center">
          <MotionHeading
            fontSize={{ base: "3xl", md: "5xl" }}
            bgGradient="linear(to-l, yellow.400, whiteAlpha.900)"
            bgClip="text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Let Our Bot Trade For You, Risk-Free
          </MotionHeading>

          <MotionText
            fontSize={{ base: "md", md: "2xl" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Our bot maximizes profits while minimizing risk. No manual trading. No mistakes. Just results.
          </MotionText>

          <MotionBox
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link href="/register" passHref>
              <Button
                size={{ base: "lg", md: "2xl" }}
                colorScheme="yellow"
                px={12}
                py={6}
                fontSize={{ base: "md", md: "xl" }}
              >
                Open Your Free Bot Account
              </Button>
            </Link>
          </MotionBox>
        </Stack>
      </Box>
    </Box>
  );
}
