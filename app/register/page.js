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
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{7,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Submitting registration form:", form);

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
      console.log("📝 API response JSON:", result);

      if (!res.ok) throw new Error(result.error || "Registration failed");

      // ✅ Show message instructing user to check email
      setEmailSent(true);
      toast({
        title: "Registration successful!",
        description: "Please check your email for the confirmation link to activate your account.",
        status: "success",
        duration: 5000,
      });

      // Optional: clear form
      setForm({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });

    } catch (err) {
      console.error("❌ Registration error:", err);
      toast({ title: "Error", description: err.message, status: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center bg="gray.50" minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="yellow.400" />
          <Text fontSize="lg" fontWeight="bold">
            Processing registration...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={16}>
      <Stack maxW="500px" mx="auto" spacing={8} bg="white" p={10} rounded="2xl" shadow="xl">
        <Heading textAlign="center">Create Your Account</Heading>
        {!emailSent ? (
          <>
            <Text textAlign="center" color="gray.600">
              Join DbossFX and start trading with confidence.
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input placeholder="Your full name" name="fullName" value={form.fullName} onChange={handleChange} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input placeholder="you@example.com" type="email" name="email" value={form.email} onChange={handleChange} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input placeholder="08012345678" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter password" name="password" value={form.password} onChange={handleChange} />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? "text" : "password"} placeholder="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                  </InputGroup>
                </FormControl>

                <Button colorScheme="yellow" w="full" type="submit">
                  Register
                </Button>
              </VStack>
            </form>
          </>
        ) : (
          <Text textAlign="center" fontSize="lg" color="green.600">
            ✅ Registration successful! Please check your email for the confirmation link to activate your account.
          </Text>
        )}
      </Stack>
    </Box>
  );
}
