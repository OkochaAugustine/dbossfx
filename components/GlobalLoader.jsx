"use client";

import { Box, Spinner, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function GlobalLoader({ type }) {
  return (
    <MotionBox
      position="fixed"
      inset={0}
      zIndex={9999}
      bg={type === "dashboard" ? "gray.900" : "black"}
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Spinner
        thickness="4px"
        speed="0.6s"
        color="yellow.400"
        size="xl"
      />
      <Text mt={6} fontSize="lg" fontWeight="bold" color="yellow.400">
        {type === "dashboard"
          ? "Securing your dashboard..."
          : "Loading global markets..."}
      </Text>
    </MotionBox>
  );
}
