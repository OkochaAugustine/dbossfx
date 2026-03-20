"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useToast,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Box,
  Heading,
  Text,
  Link
} from "@chakra-ui/react";

export default function AdminRegister() {
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast({
        title: "Please fill all fields",
        status: "error"
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ REGISTER API
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      toast({
        title: "Admin registered successfully",
        status: "success"
      });

      router.replace("/admin");

    } catch (err) {
      toast({
        title: "Registration error",
        description: err.message,
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={16} bg="gray.50" minH="100vh">
      <Box maxW="400px" mx="auto" bg="white" p={10} rounded="2xl" shadow="xl">
        <Heading textAlign="center" mb={6}>
          Admin Register
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </FormControl>

            <Button
              colorScheme="yellow"
              w="full"
              type="submit"
              isLoading={loading}
            >
              Register
            </Button>

            {/* 🔁 BACK TO LOGIN */}
            <Text fontSize="sm" textAlign="center">
              Already have an account?{" "}
              <Link
                color="yellow.500"
                fontWeight="semibold"
                cursor="pointer"
                onClick={() => router.push("/admin/login")}
              >
                Login here
              </Link>
            </Text>

          </VStack>
        </form>
      </Box>
    </Box>
  );
}