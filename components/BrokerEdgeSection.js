"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const features = [
  "Ultra-low spreads from 0.0 pips",
  "Lightning-fast execution",
  "Secure & segregated client funds",
  "Advanced trading platforms",
  "24/7 professional support",
];

export default function BrokerEdgeSection() {
  return (
    <Box
      position="relative"
      py={{ base: 20, md: 28 }}
      px={{ base: 4, md: 12 }}
      bgImage="url('/images/Mbg.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      {/* DARK OVERLAY */}
      <Box
        position="absolute"
        inset={0}
        bg="rgba(0,0,0,0.65)"
        zIndex={0}
      />

      {/* CONTENT */}
      <Flex
        position="relative"
        zIndex={1}
        maxW="1400px"
        mx="auto"
        align="center"
        gap={{ base: 12, md: 20 }}
        direction="row"
      >
        {/* LEFT */}
        <Stack flex="1" spacing={6} color="white">
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Why Trade With DbossFX
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.200">
            DbossFX delivers institutional-grade trading conditions,
            built for traders who demand speed, security, and transparency.
          </Text>

          <Button
            size="lg"
            colorScheme="yellow"
            w="fit-content"
          >
            Open Trading Account
          </Button>
        </Stack>

        {/* RIGHT */}
        <Stack flex="1" spacing={5}>
          {features.map((item, i) => (
            <MotionBox
              key={i}
              display="flex"
              alignItems="center"
              gap={4}
              color="white"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Icon
                as={CheckCircleIcon}
                boxSize={6}
                color="yellow.400"
              />
              <Text fontSize={{ base: "md", md: "lg" }}>
                {item}
              </Text>
            </MotionBox>
          ))}
        </Stack>
      </Flex>
    </Box>
  );
}
