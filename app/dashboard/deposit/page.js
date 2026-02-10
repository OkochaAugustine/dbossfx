"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Heading,
  useToast,
} from "@chakra-ui/react";

export default function DepositPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");
  const toast = useToast();

  const methods = [
    {
      key: "btc",
      label: "BTC Wallet",
      instructions: "Transfer from $100 to $10,000,000 to the wallet: 3BtXKDbYvCvXqQEnMd7GfQCbetwmU1QPgE",
    },
    {
      key: "bank",
      label: "Bank Transfer",
      instructions: "Transfer from $100 to $10,000,000 to the following bank account: DBossFX Bank Name: XYZ Bank, Account Number: 123456789, SWIFT: XYZBANK",
    },
    {
      key: "card",
      label: "Card Payment",
      instructions: "Use your debit or credit card to deposit between $100 and $10,000,000. Follow the instructions on the payment gateway.",
    },
    {
      key: "paypal",
      label: "PayPal",
      instructions: "Send from $100 to $10,000,000 via PayPal to: payments@dbossfx.com",
    },
  ];

  const handleCopy = () => {
    const textToCopy = methods.find((m) => m.key === paymentMethod)?.instructions;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied!",
        description: "Instructions have been copied to clipboard.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    });
  };

  return (
    <VStack spacing={6} p={6} align="stretch">
      {/* Back to Dashboard */}
      <Button
        colorScheme="gray"
        size="sm"
        onClick={() => router.push("/dashboard")}
        alignSelf="flex-start"
      >
        ← Back to Dashboard
      </Button>

      <Heading size="lg">Fund Your Account</Heading>
      <Text>Select your preferred payment method to deposit funds:</Text>

      {/* Payment Method Selection */}
      <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          {methods.map((method) => (
            <Radio key={method.key} value={method.key}>
              {method.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>

      {/* Instructions Box */}
      {paymentMethod && (
        <Box
          p={6}
          bg="gray.50"
          borderRadius="2xl"
          shadow="xl"
          border="2px solid"
          borderColor="yellow.400"
          transition="all 0.3s"
        >
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            {methods.find((m) => m.key === paymentMethod).label} Instructions
          </Text>
          <Text fontSize="md">
            {methods.find((m) => m.key === paymentMethod).instructions}
          </Text>
          <Button
            colorScheme="yellow"
            mt={4}
            size="lg"
            onClick={handleCopy}
          >
            Copy/Proceed
          </Button>
        </Box>
      )}
    </VStack>
  );
}
