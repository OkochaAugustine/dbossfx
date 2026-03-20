"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { ChatIcon, CloseIcon } from "@chakra-ui/icons";
import { keyframes } from "@emotion/react";

export default function GlobalChat({ isAdmin = false }) {
  const [userId, setUserId] = useState(null);
  const [userChecked, setUserChecked] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(false);
  const bottomRef = useRef(null);

  const pop = keyframes`
    0% { transform: scale(1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(1); }
    75% { transform: scale(1.3); }
    100% { transform: scale(1); }
  `;

  // ---------------- GET CURRENT USER ----------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();

        if (data?.success && data.user?.id) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setUserChecked(true);
      }
    };
    fetchUser();
  }, []);

  // ---------------- FETCH MESSAGES ----------------
  const fetchMessages = async () => {
    if (!userId && !isAdmin) return;

    let url = "/api/mongo/support?";
    if (userId) url += `userId=${userId}`;
    if (isAdmin) url += `&admin=true`;

    try {
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data?.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // ---------------- POLLING ----------------
  useEffect(() => {
    if (!userChecked) return;

    if (!userId && !isAdmin) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId, userChecked, isAdmin]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    try {
      const res = await fetch("/api/mongo/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          sender: "user",
          message: newMessage,
        }),
      });

      const data = await res.json();
      if (data?.success) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const unreadCount = messages.filter(
    (m) => m.sender === "admin" && !open
  ).length;

  // ---------------- RENDER ----------------
  if (userChecked && !userId && !isAdmin) {
    // Visitors cannot use chat
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box>
        <Box position="relative" display="flex" justifyContent="center">
          <IconButton
            icon={<ChatIcon />}
            colorScheme="yellow"
            borderRadius="full"
            size="lg"
            minH="56px"
            minW="56px"
            boxShadow="2xl"
            onClick={() => setOpen((v) => !v)}
          />

          {unreadCount > 0 && !open && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="-1"
              right="-1"
              px={2}
              sx={{ animation: `${pop} 0.6s ease-in-out infinite` }}
            >
              {unreadCount}
            </Badge>
          )}
        </Box>

        {open && (
          <Box
            mt={3}
            w={{ base: "94vw", sm: "420px" }}
            h={{ base: "75dvh", md: "450px" }}
            bg="white"
            shadow="2xl"
            rounded="3xl"
            display="flex"
            flexDirection="column"
            overflow="hidden"
            border="2px solid #FFD700"
          >
            {/* Header */}
            <HStack
              bgGradient="linear(to-r, yellow.400, yellow.500)"
              p={3}
              justify="space-between"
            >
              <Text fontWeight="bold">💬 Support Chat</Text>
              <IconButton
                aria-label="Close"
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => setOpen(false)}
              />
            </HStack>

            {/* Messages */}
            <VStack flex="1" p={3} spacing={2} overflowY="auto">
              {messages.length === 0 && (
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  No messages yet. Start the conversation!
                </Text>
              )}

              {messages.map((msg) => (
                <Box
                  key={msg._id}
                  alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
                  bg={msg.sender === "user" ? "yellow.300" : "gray.200"}
                  px={4}
                  py={2}
                  rounded="2xl"
                  maxW="80%"
                >
                  <Text fontSize="sm">
                    {msg.sender === "user" ? "You" : "Support"}: {msg.message}
                  </Text>
                </Box>
              ))}
              <div ref={bottomRef} />
            </VStack>

            {/* Input */}
            {!isAdmin && (
              <HStack p={3} borderTop="1px solid #eee">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button colorScheme="yellow" minH="44px" onClick={sendMessage}>
                  Send
                </Button>
              </HStack>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}