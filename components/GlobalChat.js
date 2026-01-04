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
import { supabase } from "@/lib/supabaseClient";
import { keyframes } from "@emotion/react";

export default function GlobalChat() {
  const [userId, setUserId] = useState(null);
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel("support-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages" },
        (payload) => {
          if (payload.new.user_id === userId) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    await supabase.from("support_messages").insert({
      user_id: userId,
      sender: "user",
      message: newMessage,
    });

    setNewMessage("");
  };

  const unreadCount = messages.filter(
    (m) => m.sender === "admin" && !open
  ).length;

  return (
    <Box
      position="fixed"
      bottom={{ base: "env(safe-area-inset-bottom, 16px)", md: "20px" }}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      pointerEvents="none"
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box pointerEvents="auto">
        {/* Toggle button */}
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
            touchAction="manipulation"
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

        {/* Chat window */}
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
              <Box>
                <Text fontWeight="bold">💬 Support Chat</Text>
                <Text fontSize="xs">
                  Usually replies within minutes
                </Text>
              </Box>

              <IconButton
                aria-label="Close"
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => setOpen(false)}
              />
            </HStack>

            {/* Messages */}
            <VStack
              flex="1"
              p={3}
              spacing={2}
              overflowY="auto"
              align="stretch"
            >
              {messages.map((msg) => (
                <HStack
                  key={msg.id}
                  justify={
                    msg.sender === "user" ? "flex-end" : "flex-start"
                  }
                >
                  <Box
                    bg={msg.sender === "user" ? "yellow.300" : "gray.200"}
                    px={4}
                    py={2}
                    rounded="2xl"
                    maxW="80%"
                  >
                    <Text fontSize="sm">{msg.message}</Text>
                  </Box>
                </HStack>
              ))}
              <div ref={bottomRef} />
            </VStack>

            {/* Input */}
            <HStack p={3} borderTop="1px solid #eee">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                colorScheme="yellow"
                minH="44px"
                onClick={sendMessage}
              >
                Send
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
