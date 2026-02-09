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

export default function AdminLogin() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast({
        title: "Please fill all fields",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ store token ONLY
      document.cookie = `admin_token=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; SameSite=Lax`;

      toast({
        title: "Login successful",
        description: "You can now access the admin dashboard.",
        status: "success",
        duration: 3000,
      });

      // ❌ NO REDIRECT HERE
      // Admin page decides access, not login page
    } catch (err) {
      toast({
        title: "Login error",
        description: err.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center bg="gray.900" minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="yellow.400" />
          <Text color="white" fontWeight="bold">
            Logging in…
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="gray.900" minH="100vh" py={16}>
      <Stack
        maxW="400px"
        mx="auto"
        spacing={8}
        bg="gray.800"
        p={10}
        rounded="2xl"
        shadow="xl"
      >
        <Heading textAlign="center" color="white">
          Admin Login
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="white">Email Address</FormLabel>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                bg="gray.700"
                color="white"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  bg="gray.700"
                  color="white"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button colorScheme="yellow" w="full" type="submit">
              Login
            </Button>

            <Text textAlign="center" color="gray.300">
              Don’t have an account?{" "}
              <Box
                as="span"
                color="red.400"
                fontWeight="bold"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => router.push("/admin/register")}
              >
                Register
              </Box>
            </Text>
          </VStack>
        </form>
      </Stack>
    </Box>
  );
}
