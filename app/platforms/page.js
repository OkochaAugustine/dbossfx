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
import { FaDesktop, FaMobileAlt, FaGlobe, FaBolt, FaShieldAlt, FaChartLine } from "react-icons/fa";

export default function PlatformsPage() {
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
            Trading Platforms
          </Badge>

          <Heading fontSize={{ base: "3xl", md: "5xl" }}>
            Powerful Trading Platforms Built for Professionals
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.300">
            Trade global markets with lightning speed, advanced tools, and
            institutional-grade technology.
          </Text>

          <Flex justify="center" gap={4} pt={4} wrap="wrap">
            <Button size="lg" colorScheme="yellow">
              Open Live Account
            </Button>
            <Button size="lg" variant="outline" colorScheme="yellow">
              Try Demo
            </Button>
          </Flex>
        </Stack>
      </Box>

      {/* ================= PLATFORMS ================= */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <Stack maxW="1300px" mx="auto" spacing={16}>
          <Stack textAlign="center" spacing={4}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
              Our Trading Platforms
            </Heading>
            <Text color="gray.600">
              Choose a platform that matches your trading style.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            {[
              {
                title: "MetaTrader 4",
                desc: "Industry-standard platform for Forex traders with expert advisors and indicators.",
              },
              {
                title: "MetaTrader 5",
                desc: "Advanced multi-asset platform with deeper analytics and faster execution.",
              },
              {
                title: "WebTrader",
                desc: "Trade directly from your browser with no downloads required.",
              },
              {
                title: "Mobile Trading",
                desc: "Trade on the go with powerful iOS and Android applications.",
              },
            ].map((p, i) => (
              <Box
                key={i}
                bg="white"
                p={6}
                rounded="2xl"
                shadow="lg"
                _hover={{ transform: "translateY(-6px)" }}
                transition="0.3s"
              >
                <Heading size="md" mb={3}>
                  {p.title}
                </Heading>
                <Text color="gray.600" mb={4}>
                  {p.desc}
                </Text>
                <Button size="sm" colorScheme="yellow">
                  Learn More
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>

      {/* ================= FEATURES ================= */}
      <Box bg="white" py={{ base: 16, md: 24 }} px={4}>
        <Stack maxW="1300px" mx="auto" spacing={16}>
          <Stack textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
              Platform Features
            </Heading>
            <Text color="gray.600">
              Built with performance, reliability, and security in mind.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {[
              {
                icon: FaBolt,
                title: "Ultra-Fast Execution",
                desc: "Trade with low latency and lightning-fast order execution.",
              },
              {
                icon: FaShieldAlt,
                title: "Secure Infrastructure",
                desc: "Enterprise-grade security protects your funds and data.",
              },
              {
                icon: FaChartLine,
                title: "Advanced Analytics",
                desc: "Professional charting tools and technical indicators.",
              },
            ].map((f, i) => (
              <VStack
                key={i}
                bg="gray.50"
                p={8}
                rounded="2xl"
                shadow="md"
                spacing={4}
              >
                <Icon as={f.icon} boxSize={10} color="yellow.400" />
                <Heading size="md">{f.title}</Heading>
                <Text textAlign="center" color="gray.600">
                  {f.desc}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>

      {/* ================= DEVICES ================= */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <Stack maxW="1300px" mx="auto" spacing={16}>
          <Stack textAlign="center">
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
              Trade on Any Device
            </Heading>
            <Text color="gray.600">
              Seamless trading experience across all platforms.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Device icon={FaDesktop} title="Desktop" />
            <Device icon={FaMobileAlt} title="Mobile" />
            <Device icon={FaGlobe} title="Web" />
          </SimpleGrid>
        </Stack>
      </Box>

      {/* ================= CTA ================= */}
      <Box bg="black" color="white" py={{ base: 16, md: 20 }} px={4}>
        <Stack maxW="1000px" mx="auto" textAlign="center" spacing={6}>
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Start Trading on Professional Platforms
          </Heading>
          <Text color="gray.300">
            Join thousands of traders using DbossFX technology worldwide.
          </Text>
          <Button size="lg" colorScheme="yellow" px={12}>
            Open Live Account
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

// ---------------- DEVICE CARD ----------------
function Device({ icon, title }) {
  return (
    <VStack bg="white" p={8} rounded="2xl" shadow="lg" spacing={4}>
      <Icon as={icon} boxSize={12} color="yellow.400" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.600" textAlign="center">
        Optimized performance for {title.toLowerCase()} trading.
      </Text>
    </VStack>
  );
}
