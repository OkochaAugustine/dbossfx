"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import AccountCreationAnimation from "@/components/AccountCreationAnimation";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{7,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast({ title: "Please fill all fields", status: "error", duration: 3000 });
      return;
    }
    if (!validateEmail(form.email)) {
      toast({ title: "Invalid email format", status: "error", duration: 3000 });
      return;
    }
    if (!validatePhone(form.phone)) {
      toast({ title: "Invalid phone number", status: "error", duration: 3000 });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords do not match", status: "error", duration: 3000 });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registration failed");

      // ✅ DO NOTHING HERE — animation will handle redirect

    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.message,
        status: "error",
        duration: 4000,
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AccountCreationAnimation
        onComplete={() => {
          setLoading(false);
          // ✅ FIXED — go to verify email page
          router.push(`/verify-email?email=${form.email}`);
        }}
      />
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={16}>
      <Stack maxW="500px" mx="auto" spacing={8} bg="white" p={10} rounded="2xl" shadow="xl">
        <Heading textAlign="center">Create Your Account</Heading>
        <Text textAlign="center" color="gray.600">
          Join DbossFX and start trading with confidence.
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input name="fullName" value={form.fullName} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" name="email" value={form.email} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input type="tel" name="phone" value={form.phone} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <InputRightElement width="4.5rem">
                  <Button size="sm" h="1.75rem" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>

            <Button colorScheme="yellow" w="full" type="submit">
              Register
            </Button>
          </VStack>
        </form>
      </Stack>
    </Box>
  );
}