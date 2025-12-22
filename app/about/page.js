"use client";

import { useRef, useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  VStack,
  Badge,
  IconButton,
} from "@chakra-ui/react";

// ===== INLINE ICONS =====
const VolumeMuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12l4.5 4.5-1.5 1.5L15 13.5l-4.5 4.5H6v-6H2v-4h4V6h4.5L15 10.5l4.5-4.5 1.5 1.5z" />
  </svg>
);

const VolumeUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.77.58-3.41 1.55-4.71L16.71 19.45A7.946 7.946 0 0112 20zM20.45 16.71L7.29 3.55A7.946 7.946 0 0112 4c4.41 0 8 3.59 8 8 0 1.77-.58 3.41-1.55 4.71z" />
  </svg>
);

const ChartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17h2v-7H3v7zm4 0h2v-4H7v4zm4 0h2v-10h-2v10zm4 0h2v-6h-2v6zm4 0h2v-2h-2v2z" />
  </svg>
);

const AwardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.39 4.84 5.36.78-3.88 3.78.92 5.36L12 14.77l-4.79 2.53.92-5.36-3.88-3.78 5.36-.78L12 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l8 4v6c0 5-3.58 9.36-8 10-4.42-.64-8-5-8-10V6l8-4z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

// ===== COMPONENTS =====
function InfoCard({ icon, title, text }) {
  return (
    <VStack bg="whiteAlpha.900" p={10} rounded="2xl" shadow="lg" spacing={5}>
      {icon}
      <Heading size="lg">{title}</Heading>
      <Text color="gray.600" textAlign="center">
        {text}
      </Text>
    </VStack>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <VStack bg="whiteAlpha.900" p={8} rounded="2xl" shadow="lg" spacing={4}>
      {icon}
      <Heading size="md">{title}</Heading>
      <Text color="gray.600" textAlign="center">
        {text}
      </Text>
    </VStack>
  );
}

// ===== MAIN PAGE =====
export default function AboutPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <Box bg="gray.50" minH="100vh">
      {/* ===== HERO VIDEO ===== */}
      <Box position="relative" h={{ base: "90vh", md: "100vh" }} overflow="hidden">
        <Box
          as="video"
          ref={videoRef}
          src="/videos/about-v.mp4"
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
        />
        <Box position="absolute" inset="0" bg="black" opacity="0.65" />
        <IconButton
          aria-label="Toggle sound"
          icon={muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
          position="absolute"
          top="20px"
          right="20px"
          zIndex="3"
          colorScheme="yellow"
          variant="solid"
          onClick={toggleSound}
        />
        <Flex position="relative" zIndex="2" h="100%" align="center" justify="center" px={4}>
          <Stack maxW="1200px" spacing={6} textAlign="center" color="white">
            <Badge colorScheme="yellow" mx="auto">
              About Us
            </Badge>
            <Heading fontSize={{ base: "3xl", md: "5xl" }}>
              Empowering Traders with Technology, Trust & Transparency
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.300">
              We are building a global trading ecosystem designed for serious
              traders who demand performance, reliability, and integrity.
            </Text>
            <Flex justify="center" gap={4} pt={4} wrap="wrap">
              <Button size="lg" colorScheme="yellow" px={10}>
                Start Trading
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200" }}
                px={10}
              >
                Our Platforms
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Box>

      {/* ===== WHO WE ARE ===== */}
      <Box
        bgImage="url('/images/about-bg.png')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
        py={{ base: 16, md: 24 }}
        px={4}
      >
        <Box position="absolute" inset="0" bg="blackAlpha.600" />
        <Stack
          maxW="1200px"
          mx="auto"
          spacing={14}
          position="relative"
          zIndex={2}
          direction={{ base: "column", md: "row" }}
        >
          <Stack spacing={6} flex={1} color="white">
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>Who We Are</Heading>
            <Text fontSize="lg">
              DbossFX is a modern trading company committed to delivering
              institutional-grade trading technology to retail and
              professional traders worldwide.
            </Text>
            <Text>
              Our focus is simple: provide a transparent, secure, and
              high-performance trading environment where traders can execute
              with confidence and precision.
            </Text>
            <Button colorScheme="yellow" w="fit-content">
              Open Live Account
            </Button>
          </Stack>
          <VStack
            bg="whiteAlpha.900"
            p={10}
            rounded="2xl"
            shadow="xl"
            spacing={6}
            flex={1}
          >
            <GlobeIcon />
            <Heading size="lg">Global Reach</Heading>
            <Text textAlign="center" color="gray.600">
              Serving traders globally with reliable infrastructure and
              seamless access to international markets.
            </Text>
          </VStack>
        </Stack>
      </Box>

      {/* ===== MISSION & VISION ===== */}
      <Box
        bgImage="url('/images/about2-bg.png')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
        py={{ base: 16, md: 24 }}
        px={4}
      >
        <Box position="absolute" inset="0" bg="blackAlpha.600" />
        <SimpleGrid
          maxW="1200px"
          mx="auto"
          columns={{ base: 1, md: 2 }}
          spacing={10}
          position="relative"
          zIndex={2}
        >
          <InfoCard
            icon={<ChartIcon />}
            title="Our Mission"
            text="To empower traders with advanced platforms, transparent pricing, and professional-grade tools."
          />
          <InfoCard
            icon={<AwardIcon />}
            title="Our Vision"
            text="To become a globally trusted trading brand built on integrity, innovation, and performance."
          />
        </SimpleGrid>
      </Box>

      {/* ===== CORE VALUES ===== */}
      <Box
        bgImage="url('/images/about3-bg.png')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
        py={{ base: 16, md: 24 }}
        px={4}
      >
        <Box position="absolute" inset="0" bg="blackAlpha.600" />
        <Stack
          maxW="1200px"
          mx="auto"
          spacing={12}
          textAlign="center"
          position="relative"
          zIndex={2}
        >
          <Heading fontSize={{ base: "2xl", md: "4xl" }} color="white">
            Our Core Values
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <ValueCard
              icon={<ShieldIcon />}
              title="Security"
              text="Client protection and secure trading infrastructure."
            />
            <ValueCard
              icon={<UsersIcon />}
              title="Client First"
              text="We build solutions around trader success."
            />
            <ValueCard
              icon={<ChartIcon />}
              title="Performance"
              text="Fast execution, reliable platforms, tight spreads."
            />
          </SimpleGrid>
        </Stack>
      </Box>

      {/* ===== FINAL CTA ===== */}
      <Box bg="black" color="white" py={{ base: 16, md: 20 }} px={4}>
        <Stack maxW="900px" mx="auto" textAlign="center" spacing={6}>
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Trade with Confidence. Trade with DbossFX.
          </Heading>
          <Text color="gray.300">
            Join traders worldwide using professional-grade trading solutions.
          </Text>
          <Button size="lg" colorScheme="yellow" px={12}>
            Get Started Today
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
