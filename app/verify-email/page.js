"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Button,
  Center,
  VStack,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon, EmailIcon } from "@chakra-ui/icons";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [statusType, setStatusType] = useState("loading"); // loading | success | error | info

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus(
        "🎉 Thank you for joining! Please check your email and click the verification link we sent you."
      );
      setStatusType("info");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus(data.message || "✅ Email verified successfully!");
          setStatusType("success");
        } else {
          setStatus(
            data.error ||
              "⚠️ Could not verify your email. Please check your inbox for a valid link."
          );
          setStatusType("error");
        }
      } catch (err) {
        console.error("Verify error:", err);
        setStatus(
          "⚠️ Something went wrong while verifying your email. Please try again later."
        );
        setStatusType("error");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (statusType) {
      case "success":
        return <CheckCircleIcon boxSize={16} color="green.400" />;
      case "error":
        return <CloseIcon boxSize={16} color="red.400" />;
      case "info":
        return <EmailIcon boxSize={16} color="blue.400" />;
      default:
        return <Spinner size="xl" thickness="4px" color="gray.500" />;
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white" px={4}>
      <Box
        bg="gray.50"
        rounded="3xl"
        shadow="lg"
        p={10}
        maxW="lg"
        w="full"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Heading size="2xl">Email Verification</Heading>
          <Center>{getStatusIcon()}</Center>
          <Text fontSize="xl" color="gray.700">
            {status}
          </Text>

          {(statusType === "success" || statusType === "info") && (
            <Button
              mt={4}
              colorScheme="green"
              size="lg"
              onClick={() => (window.location.href = "/login")}
              boxShadow="md"
              _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
              transition="all 0.3s"
            >
              Go to Login
            </Button>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}