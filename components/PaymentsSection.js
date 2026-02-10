"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Button,
  Image,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);

const paymentMethods = [
  {
    title: "Bank Transfer",
    desc: "Deposit via secure bank transfers with instant account funding.",
    img: "/images/bank.png",
  },
  {
    title: "Visa / Mastercard",
    desc: "Fund your account instantly with major credit cards.",
    img: "/images/card.png",
  },
  {
    title: "Cryptocurrency",
    desc: "Use Bitcoin, Ethereum, or other supported crypto coins to deposit.",
    img: "/images/crypto.png",
  },
  {
    title: "Fast Withdrawals",
    desc: "Withdraw your funds safely within 24 hours.",
    img: "/images/withdraw.png",
  },
];

export default function PaymentsSection() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      {/* MAIN SECTION */}
      <Box
        bgImage="url('/images/payments-bg.jpg')"
        bgSize="cover"
        bgPos="center"
        py={{ base: 20, md: 28 }}
        px={{ base: 4, md: 12 }}
      >
        <Stack
          maxW="1400px"
          mx="auto"
          spacing={14}
          color="white"
          textAlign="center"
        >
          {/* HEADER */}
          <Stack spacing={4}>
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
              Easy & Secure Payments
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.200">
              Deposit and withdraw funds quickly and securely with multiple
              options. Your money, always safe.
            </Text>
          </Stack>

          {/* PAYMENT METHODS */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
            {paymentMethods.map((method, i) => (
              <MotionBox
                key={i}
                textAlign="center"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Box mx="auto" mb={4} w={16} h={16}>
                  <Image
                    src={method.img}
                    alt={method.title}
                    width={64}
                    height={64}
                  />
                </Box>

                <Heading fontSize="lg" mb={2}>
                  {method.title}
                </Heading>

                <Text fontSize="sm" color="gray.200">
                  {method.desc}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* FUND ACCOUNT BUTTON */}
          <Stack pt={10}>
            <Button
              size="lg"
              colorScheme="yellow"
              onClick={onOpen}
            >
              Fund Account Now
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* OVERLAY SCREEN */}
      {isOpen && (
        <Flex
          position="fixed"
          inset={0}
          zIndex={9999}
          bg="blackAlpha.800"
          backdropFilter="blur(12px)"
          align="center"
          justify="center"
          px={4}
        >
          <MotionBox
            bg="gray.900"
            p={{ base: 8, md: 12 }}
            rounded="2xl"
            maxW="520px"
            w="100%"
            textAlign="center"
            color="white"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Heading fontSize="2xl" mb={4}>
              Sorry, Visitor
            </Heading>

            <Text color="gray.300" mb={8}>
              You are not a registered user.  
              Please create an account to continue.
            </Text>

            <Stack direction="row" spacing={4} justify="center">
              <Button
                variant="outline"
                colorScheme="yellow"
                onClick={onClose}
              >
                Okay
              </Button>

              <Button
                colorScheme="yellow"
                onClick={() => router.push("/app/register")}
              >
                Proceed
              </Button>
            </Stack>
          </MotionBox>
        </Flex>
      )}
    </>
  );
}
