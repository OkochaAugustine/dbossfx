"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Spinner,
  Center,
  Divider,
  VStack,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  // ------------------- AUTH FETCH -------------------
  const authFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      credentials: "include", // ✅ send cookies
      headers: { "Content-Type": "application/json" },
    });
  };

  // ------------------- VERIFY ADMIN TOKEN -------------------
  const verifyToken = async () => {
    try {
      const res = await authFetch("/api/admin/verify-token");
      const data = await res.json();

      if (!res.ok || !data.valid) throw new Error("Auth failed");

      // Token valid → fetch accounts
      await fetchAccounts();
    } catch (err) {
      toast({
        title: "Authentication error",
        description: "Please login again.",
        status: "error",
        duration: 4000,
      });
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  };

  // ------------------- FETCH ACCOUNTS -------------------
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/api/admin/getAccounts");
      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.error || "Failed to fetch accounts");

      setAccounts(
        result.data.map((acc) => ({
          ...acc,
          balance: acc.balance ?? 0,
          earned_profit: acc.earned_profit ?? 0,
          active_deposit: acc.active_deposit ?? 0,
        }))
      );
    } catch (err) {
      toast({
        title: "Error fetching accounts",
        description: err.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // ------------------- HANDLE INPUT CHANGE -------------------
  const handleChange = (userId, field, value) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.user_id === userId ? { ...acc, [field]: value } : acc))
    );
  };

  // ------------------- SAVE ACCOUNT -------------------
  const handleSave = async (account) => {
    setSavingId(account.user_id);
    try {
      const res = await authFetch("/api/admin/updateAccount", {
        method: "POST",
        body: JSON.stringify({
          id: account.account_id,
          balance: Number(account.balance),
          earned_profit: Number(account.earned_profit),
          active_deposit: Number(account.active_deposit),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || "Failed to update account");

      toast({ title: "Account updated", status: "success", duration: 2000 });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 4000 });
    } finally {
      setSavingId(null);
    }
  };

  // ------------------- SUPPORT MESSAGES -------------------
  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (mounted) setMessages(data || []);
    };

    loadMessages();

    const channel = supabase
      .channel("support-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages" },
        (payload) => {
          if (mounted) setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const sendReply = async (userId) => {
    const message = replyInputs[userId]?.trim();
    if (!message) return;

    await supabase.from("support_messages").insert({
      user_id: userId,
      sender: "admin",
      message,
    });

    setReplyInputs((prev) => ({ ...prev, [userId]: "" }));
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="yellow.400" />
      </Center>
    );
  }

  const groupedMessages = messages.reduce((acc, msg) => {
    acc[msg.user_id] = acc[msg.user_id] || [];
    acc[msg.user_id].push(msg);
    return acc;
  }, {});

  return (
    <Box p={[4, 6, 8]} maxW="100vw">
      <Heading mb={6} fontSize={["xl", "2xl"]}>Admin Dashboard</Heading>

      {/* ACCOUNTS TABLE */}
      <Box overflowX="auto" mb={10}>
        <Table size="sm" minW="900px">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Balance</Th>
              <Th>Profit</Th>
              <Th>Deposit</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((acc) => (
              <Tr key={acc.user_id}>
                <Td>{acc.full_name}</Td>
                <Td>{acc.email}</Td>
                <Td>{acc.phone}</Td>
                <Td>
                  <Input size="sm" type="number" value={acc.balance} onChange={(e) => handleChange(acc.user_id, "balance", e.target.value)} />
                </Td>
                <Td>
                  <Input size="sm" type="number" value={acc.earned_profit} onChange={(e) => handleChange(acc.user_id, "earned_profit", e.target.value)} />
                </Td>
                <Td>
                  <Input size="sm" type="number" value={acc.active_deposit} onChange={(e) => handleChange(acc.user_id, "active_deposit", e.target.value)} />
                </Td>
                <Td>
                  <Button size="sm" colorScheme="yellow" isLoading={savingId === acc.user_id} onClick={() => handleSave(acc)}>
                    Save
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Divider my={6} />

      {/* SUPPORT CHAT */}
      <Heading size="md" mb={4}>Live Support Messages</Heading>

      {Object.entries(groupedMessages).map(([userId, msgs]) => (
        <Box key={userId} mb={6} p={4} border="1px solid" borderColor="gray.200" rounded="xl">
          <Text fontWeight="bold" mb={2}>User ID: {userId}</Text>
          <VStack align="stretch" spacing={2}>
            {msgs.map((m) => (
              <Box key={m.id} p={2} bg={m.sender === "user" ? "yellow.100" : "gray.200"} rounded="md">
                <Text fontSize="sm" fontWeight="bold">{m.sender}</Text>
                <Text fontSize="sm">{m.message}</Text>
              </Box>
            ))}
          </VStack>

          <HStack mt={3} spacing={2}>
            <Input placeholder="Reply..." size="sm" value={replyInputs[userId] || ""} onChange={(e) => setReplyInputs((p) => ({ ...p, [userId]: e.target.value }))} />
            <Button size="sm" colorScheme="yellow" onClick={() => sendReply(userId)}>Send</Button>
          </HStack>
        </Box>
      ))}
    </Box>
  );
}
