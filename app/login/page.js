"use client";

import { useState } from "react";
import {
  Box, Stack, Heading, Text, Input, Button, VStack, FormControl, FormLabel,
  InputGroup, InputRightElement, useToast, Spinner, Center
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast({ title: "Please fill all fields", status: "error", duration: 3000 });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      toast({ title: `Welcome back, ${data.user.email}!`, status: "success", duration: 3000 });
      router.push("/dashboard"); // redirect to dashboard

    } catch (err) {
      toast({
        title: "Login failed",
        description: err.message || err.error_description,
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center bg="gray.50" minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="yellow.400" />
          <Text fontSize="lg" fontWeight="bold">Logging in...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={16}>
      <Stack maxW="500px" mx="auto" spacing={8} bg="white" p={10} rounded="2xl" shadow="xl">
        <Heading textAlign="center">Login to Your Account</Heading>
        <Text textAlign="center" color="gray.600">Welcome back! Please enter your credentials to continue.</Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                placeholder="you@example.com"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button colorScheme="yellow" w="full" type="submit">Login</Button>

            <Text textAlign="center" color="gray.500">
              Don't have an account?{" "}
              <Button
                variant="link"
                colorScheme="blue"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
            </Text>
          </VStack>
        </form>
      </Stack>
    </Box>
  );
}
