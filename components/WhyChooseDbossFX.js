"use client";

import {
  Box,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { motion } from "framer-motion";

/* ---------------- ANIMATED TEXT ---------------- */

const MotionHeading = motion("h2");
const MotionText = motion(Text);

const headingWords = ["Built", "for", "Serious", "Traders"];

function AnimatedBrokerText() {
  return (
    <Stack spacing={6}>
      <MotionHeading
        style={{
          fontSize: "clamp(24px, 4vw, 48px)",
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {headingWords.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: "inline-block", marginRight: "8px" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          >
            {word === "Serious" || word === "Traders" ? (
              <span
                style={{
                  color: "#ECC94B",
                  textShadow: "0 0 20px rgba(236,201,75,0.6)",
                }}
              >
                {word}
              </span>
            ) : (
              word
            )}
          </motion.span>
        ))}
      </MotionHeading>

      <MotionText
        fontSize={{ base: "md", md: "lg" }}
        color="gray.600"
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 1 }}
        viewport={{ once: true }}
      >
        DbossFX delivers professional trading conditions designed for speed,
        transparency, and long-term performance.
      </MotionText>
    </Stack>
  );
}

/* ---------------- MAIN SECTION ---------------- */

export default function WhyChooseDbossFX() {
  return (
    <Box py={{ base: 20, md: 28 }} px={{ base: 4, md: 12 }} bg="white">
      <Flex
        maxW="1400px"
        mx="auto"
        align="center"
        gap={{ base: 8, md: 20 }}
        direction="row"
      >
        {/* LEFT TEXT */}
        <Box flex="1">
          <AnimatedBrokerText />
        </Box>

        {/* RIGHT IMAGE */}
        <Box
          flex="1"
          position="relative"
          h={{ base: "260px", md: "380px" }}
          rounded="2xl"
          overflow="hidden"
        >
          <Image
            src="/images/traders.jpg"
            alt="Professional Traders"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>
      </Flex>
    </Box>
  );
}
