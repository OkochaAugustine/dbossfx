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

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  // ------------------- Fetch users + accounts -------------------
  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/getAccounts");
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch users");
      }

      // ✅ FIX: result.data is the array (not result itself)
      const sanitized = result.data.map((acc) => ({
        ...acc,
        balance: acc.balance ?? 0,
        earned_profit: acc.earned_profit ?? 0,
        active_deposit: acc.active_deposit ?? 0,
      }));

      setAccounts(sanitized);
    } catch (err) {
      toast({
        title: "Error fetching users",
        description: err.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ------------------- Handle input change -------------------
  const handleChange = (userId, field, value) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.user_id === userId ? { ...acc, [field]: value } : acc
      )
    );
  };

  // ------------------- Save account -------------------
  const handleSave = async (account) => {
    setSavingId(account.user_id);

    try {
      const payload = {
        id: account.account_id,
        balance: Number(account.balance),
        earned_profit: Number(account.earned_profit),
        active_deposit: Number(account.active_deposit),
      };

      const res = await fetch("/api/admin/updateAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update account");
      }

      toast({
        title: "Account updated",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setSavingId(null);
    }
  };

  // ------------------- Support messages -------------------
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

    try {
      await supabase.from("support_messages").insert({
        user_id: userId,
        sender: "admin",
        message,
      });

      setReplyInputs((prev) => ({ ...prev, [userId]: "" }));
    } catch (err) {
      toast({
        title: "Error sending reply",
        description: err.message,
        status: "error",
        duration: 4000,
      });
    }
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
    <Box p={8}>
      <Heading mb={6}>Admin Dashboard – Registered Users</Heading>

      <Table size="sm" mb={12}>
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
                <Input
                  size="sm"
                  type="number"
                  value={acc.balance}
                  onChange={(e) =>
                    handleChange(acc.user_id, "balance", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  size="sm"
                  type="number"
                  value={acc.earned_profit}
                  onChange={(e) =>
                    handleChange(acc.user_id, "earned_profit", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  size="sm"
                  type="number"
                  value={acc.active_deposit}
                  onChange={(e) =>
                    handleChange(acc.user_id, "active_deposit", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  isLoading={savingId === acc.user_id}
                  onClick={() => handleSave(acc)}
                >
                  Save
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Divider my={6} />

      <Heading size="md" mb={4}>
        Live Support Messages
      </Heading>

      {Object.entries(groupedMessages).map(([userId, msgs]) => (
        <Box key={userId} mb={6} p={4} border="1px solid #eee" rounded="xl">
          <Heading size="sm" mb={2}>
            User ID: {userId}
          </Heading>

          <VStack align="stretch">
            {msgs.map((m) => (
              <Box
                key={m.id}
                p={2}
                bg={m.sender === "user" ? "yellow.100" : "gray.200"}
                rounded="md"
              >
                <Text fontWeight="bold">{m.sender}</Text>
                <Text>{m.message}</Text>
              </Box>
            ))}
          </VStack>

          <HStack mt={2}>
            <Input
              placeholder="Reply..."
              value={replyInputs[userId] || ""}
              onChange={(e) =>
                setReplyInputs((p) => ({
                  ...p,
                  [userId]: e.target.value,
                }))
              }
            />
            <Button
              colorScheme="yellow"
              onClick={() => sendReply(userId)}
            >
              Send
            </Button>
          </HStack>
        </Box>
      ))}
    </Box>
  );
}
