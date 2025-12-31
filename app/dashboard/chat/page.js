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
import { supabase } from "@/lib/supabaseClient";

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
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    getUser();
  }, []);

  /* =====================
     FETCH CHAT HISTORY
  ====================== */
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoading(false);
    };

    fetchMessages();

    /* =====================
       REALTIME SUBSCRIPTION
    ====================== */
    const channel = supabase
      .channel("support-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
        },
        (payload) => {
          if (payload.new.user_id === userId) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

    await supabase.from("support_messages").insert({
      user_id: userId,
      sender: "user",
      message: newMessage,
    });

    setNewMessage("");
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
        <VStack
          flex="1"
          p={4}
          spacing={3}
          overflowY="auto"
          align="stretch"
        >
          {messages.map((msg) => (
            <HStack
              key={msg.id}
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
