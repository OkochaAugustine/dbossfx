// app/admin/register/page.js
// @ts-nocheck
"use client";

import { useState } from "react";
import { useToast, Button, Input, FormControl, FormLabel, VStack, Box, Heading, Text } from "@chakra-ui/react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{7,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast({ title: "Error", description: "Please fill all fields", status: "error" });
      return;
    }
    if (!validateEmail(form.email)) {
      toast({ title: "Error", description: "Invalid email format", status: "error" });
      return;
    }
    if (!validatePhone(form.phone)) {
      toast({ title: "Error", description: "Invalid phone number", status: "error" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", status: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registration failed");

      setEmailSent(true);
      toast({
        title: "Success",
        description: "✅ Check your email for the confirmation link",
        status: "success",
        duration: 5000,
      });

      setForm({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={16} bg="gray.50" minH="100vh">
      <Box maxW="500px" mx="auto" bg="white" p={10} rounded="2xl" shadow="xl">
        <Heading textAlign="center" mb={4}>Create Account</Heading>
        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input name="fullName" value={form.fullName} onChange={handleChange} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" value={form.email} onChange={handleChange} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input name="phone" type="tel" value={form.phone} onChange={handleChange} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input name="password" type="password" value={form.password} onChange={handleChange} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
              </FormControl>

              <Button colorScheme="yellow" w="full" type="submit" isLoading={loading}>
                Register
              </Button>
            </VStack>
          </form>
        ) : (
          <Text textAlign="center" color="green.600" fontWeight="bold">
            ✅ Check your email for the confirmation link
          </Text>
        )}
      </Box>
    </Box>
  );
}