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

/* ===== INLINE ICONS ===== */
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
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
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
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z" />
  </svg>
);

/* ===== SMALL COMPONENTS ===== */
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

/* ===== MAIN PAGE ===== */
export default function AboutPage() {
  const videoRef = useRef(null); // ✅ FIXED (NO TypeScript generic)
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
          inset="0"
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
          onClick={toggleSound}
        />

        <Flex position="relative" zIndex="2" h="100%" align="center" justify="center">
          <Stack maxW="1200px" spacing={6} textAlign="center" color="white">
            <Badge colorScheme="yellow" mx="auto">
              About Us
            </Badge>
            <Heading fontSize={{ base: "3xl", md: "5xl" }}>
              Empowering Traders with Technology, Trust & Transparency
            </Heading>
            <Text color="gray.300">
              A global trading ecosystem built for serious traders.
            </Text>
            <Flex justify="center" gap={4} wrap="wrap">
              <Button size="lg" colorScheme="yellow">
                Start Trading
              </Button>
              <Button size="lg" variant="outline" color="white">
                Our Platforms
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Box>

      {/* ===== CORE VALUES ===== */}
      <Box py={20} px={4}>
        <Stack maxW="1200px" mx="auto" spacing={10} textAlign="center">
          <Heading>Our Core Values</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <ValueCard icon={<ShieldIcon />} title="Security" text="Client protection first." />
            <ValueCard icon={<UsersIcon />} title="Client First" text="Trader success is our focus." />
            <ValueCard icon={<ChartIcon />} title="Performance" text="Fast & reliable execution." />
          </SimpleGrid>
        </Stack>
      </Box>
    </Box>
  );
}
