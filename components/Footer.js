"use client";

import { Box, HStack, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

const MotionIconButton = motion(IconButton);
const MotionBox = motion(Box);

export default function DashboardFooter() {
  const [flipNav, setFlipNav] = useState(false);

  const socialLinks = [
    { icon: FaFacebook, label: "Facebook", href: "#" },
    { icon: FaTwitter, label: "Twitter", href: "#" },
    { icon: FaLinkedin, label: "LinkedIn", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaEnvelope, label: "Newsletter", href: "#" },
  ];

  return (
    <Box
      as="footer"
      w="full"
      bg="transparent"          // FULL TRANSPARENT
      py={2}
      px={4}
      backdropFilter="none"     // No blur
      zIndex={100}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pointerEvents="none"      // Footer won't block clicks
    >
      {/* Social Buttons */}
      <HStack spacing={4} pointerEvents="auto">
        {socialLinks.map((s, i) => (
          <Tooltip key={i} label={s.label} placement="top">
            <MotionIconButton
              as="a"
              href={s.href}
              icon={<s.icon />}
              variant="ghost"
              colorScheme="yellow"
              whileHover={{
                scale: 1.3,
                rotate: [0, 15, -15, 0],
                textShadow: "0px 0px 8px rgb(255,255,0)",
                boxShadow: "0px 0px 12px rgb(255,255,0)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-label={s.label}
              pointerEvents="auto" // ensure buttons are clickable
            />
          </Tooltip>
        ))}
      </HStack>

      {/* Flip Nav Area */}
      <MotionBox
        mt={1}
        textAlign="center"
        cursor="pointer"
        onClick={() => setFlipNav((f) => !f)}
        whileHover={{ scale: 1.05 }}
        pointerEvents="auto"
      >
        <AnimatePresence>
          {flipNav ? (
            <MotionBox
              key="back"
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Text fontSize="xs" color="gray.400">
                Support | Terms | Privacy
              </Text>
            </MotionBox>
          ) : (
            <MotionBox
              key="front"
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -90, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Text fontSize="xs" color="gray.400">
                DbossFX, 123 Forex Street, Ontario, Canada | © 2025 All Rights Reserved
              </Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </MotionBox>
    </Box>
  );
}
