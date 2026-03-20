"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Divider,
  Button,
  Input,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH CURRENT USER
  ====================== */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.success) {
          router.replace("/login");
          return;
        }

        setUser(data.user);
        setName(data.user.full_name || "");
      } catch (err) {
        toast({
          title: "Error fetching user",
          description: err.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* =====================
     UPDATE NAME
  ====================== */

  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast({
        title: "Name cannot be empty",
        status: "warning",
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/update-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: name }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      toast({
        title: "Name updated",
        description: "Your display name has been updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setUser((prev) => ({ ...prev, full_name: name }));
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.message,
        status: "error",
      });
    }
  };

  /* =====================
     LOGOUT
  ====================== */

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch (err) {
      toast({
        title: "Logout failed",
        description: err.message,
        status: "error",
      });
    }
  };

  /* =====================
     LOADING
  ====================== */

  if (loading) {
    return (
      <Box h="60vh" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box w="100%" maxW="600px">
      <Heading size="md" mb={4}>
        Dashboard Settings
      </Heading>

      <VStack spacing={5} align="stretch">

        {/* THEME */}
        <Box>
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel mb="0">Theme</FormLabel>

            <HStack spacing={2}>
              <SunIcon color={colorMode === "light" ? "yellow.400" : "gray.400"} />

              <Switch
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
                colorScheme="yellow"
              />

              <MoonIcon color={colorMode === "dark" ? "yellow.400" : "gray.400"} />
            </HStack>
          </FormControl>

          <Text fontSize="sm" color="gray.500" mt={1}>
            Toggle between Light and Dark mode
          </Text>
        </Box>

        <Divider />

        {/* ACCOUNT INFO */}
        <Box>
          <Heading size="sm" mb={2}>
            Account Info
          </Heading>

          <Text fontSize="sm" color="gray.600">
            Email: {user?.email}
          </Text>

          <Input
            mt={2}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button mt={2} colorScheme="blue" onClick={handleUpdateName}>
            Update Name
          </Button>
        </Box>

        <Divider />

        {/* ACCOUNT ACTIONS */}
        <Box>
          <Heading size="sm" mb={2}>
            Account Preferences
          </Heading>

          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

      </VStack>
    </Box>
  );
}