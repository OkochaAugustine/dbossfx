"use client";

import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Spinner,
  Heading,
} from "@chakra-ui/react";

export default function ChatPage() {
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  /* =====================
     GET CURRENT USER
  ====================== */
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data?.user?.id) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    getUser();
  }, []);

  /* =====================
     FETCH CHAT HISTORY
  ====================== */
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?userId=${userId}`);
        const data = await res.json();

        setMessages(data.messages || []);
      } catch (err) {
        console.error("Fetch messages error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  /* =====================
     AUTO SCROLL
  ====================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =====================
     SEND MESSAGE
  ====================== */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          sender: "user",
          message: newMessage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="yellow.400" />
      </Flex>
    );
  }

  return (
    <Flex h="100vh" bg="gray.100" justify="center" p={4} overflow="hidden">
      <Box
        w="100%"
        maxW="800px"
        bg="white"
        rounded="2xl"
        shadow="2xl"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* HEADER */}
        <Box p={4} bg="yellow.400">
          <Heading size="md" color="black">
            💬 Live Support Chat
          </Heading>

          <Text fontSize="sm" color="blackAlpha.800">
            Our team usually replies within minutes
          </Text>
        </Box>

        {/* MESSAGES */}
        <VStack flex="1" p={4} spacing={3} overflowY="auto" align="stretch">
          {messages.map((msg) => (
            <HStack
              key={msg._id || msg.id}
              justify={msg.sender === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                bg={msg.sender === "user" ? "yellow.300" : "gray.200"}
                px={4}
                py={2}
                rounded="xl"
                maxW="75%"
              >
                <Text fontSize="sm">{msg.message}</Text>
              </Box>
            </HStack>
          ))}
          <div ref={bottomRef} />
        </VStack>

        {/* INPUT */}
        <HStack p={4} borderTop="1px solid #eee">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <Button colorScheme="yellow" onClick={sendMessage}>
            Send
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
}