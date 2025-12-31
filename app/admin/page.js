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
  VStack,
  Text,
  Divider,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const toast = useToast();

  // ------------------- Fetch accounts -------------------
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/getAccounts");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch accounts");

      const normalized = data.map((item) => ({
        account_id: item.account_id,
        user_id: item.user_id,
        full_name: item.full_name ?? "",
        email: item.email ?? "",
        phone: item.phone ?? "",
        balance:
          accounts.find((a) => a.account_id === item.account_id)?.balance ??
          item.balance ??
          0,
        earned_profit:
          accounts.find((a) => a.account_id === item.account_id)
            ?.earned_profit ?? item.earned_profit ?? 0,
        active_deposit:
          accounts.find((a) => a.account_id === item.account_id)
            ?.active_deposit ?? item.active_deposit ?? 0,
      }));

      setAccounts(normalized);
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
    fetchAccounts();
  }, []);

  const handleChange = (accountId, field, value) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.account_id === accountId ? { ...acc, [field]: value } : acc
      )
    );
  };

  const handleSave = async (account) => {
    if (!account.account_id) return;

    setSavingId(account.account_id);

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

      if (!res.ok || !result.success)
        throw new Error(result.error || "Failed to save account");

      toast({
        title: "Account updated successfully",
        status: "success",
        duration: 3000,
      });

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.account_id === account.account_id
            ? {
                ...acc,
                balance: payload.balance,
                earned_profit: payload.earned_profit,
                active_deposit: payload.active_deposit,
              }
            : acc
        )
      );
    } catch (err) {
      toast({
        title: "Error saving account",
        description: err.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setSavingId(null);
    }
  };

  // ------------------- Fetch support messages -------------------
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    const channel = supabase
      .channel("support-chat-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ------------------- Admin reply -------------------
  const handleReplyChange = (userId, value) => {
    setReplyInputs((prev) => ({ ...prev, [userId]: value }));
  };

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

  // Group messages by user_id
  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.user_id]) acc[msg.user_id] = [];
    acc[msg.user_id].push(msg);
    return acc;
  }, {});

  return (
    <Box p={8}>
      <Heading mb={6}>Admin Dashboard - Account Statements</Heading>

      {/* ================= Account Table ================= */}
      <Table variant="simple" size="sm" mb={12}>
        <Thead>
          <Tr>
            <Th>Full Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Balance</Th>
            <Th>Earned Profit</Th>
            <Th>Active Deposit</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {accounts.map((acc) => (
            <Tr key={acc.account_id}>
              <Td>{acc.full_name}</Td>
              <Td>{acc.email}</Td>
              <Td>{acc.phone}</Td>
              <Td>
                <Input
                  size="sm"
                  type="number"
                  value={acc.balance}
                  onChange={(e) =>
                    handleChange(acc.account_id, "balance", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  size="sm"
                  type="number"
                  value={acc.earned_profit}
                  onChange={(e) =>
                    handleChange(acc.account_id, "earned_profit", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  size="sm"
                  type="number"
                  value={acc.active_deposit}
                  onChange={(e) =>
                    handleChange(acc.account_id, "active_deposit", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  isLoading={savingId === acc.account_id}
                  onClick={() => handleSave(acc)}
                >
                  Save
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Divider mb={6} />

      {/* ================= Support Messages ================= */}
      <Heading size="md" mb={4}>
        Live Support Messages
      </Heading>
      {Object.keys(groupedMessages).map((userId) => (
        <Box key={userId} mb={6} border="1px solid #eee" p={3} rounded="xl">
          <Heading size="sm" mb={2}>
            User ID: {userId}
          </Heading>
          <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
            {groupedMessages[userId].map((msg) => (
              <Box
                key={msg.id}
                p={3}
                rounded="lg"
                bg={msg.sender === "user" ? "yellow.100" : "gray.200"}
              >
                <Text fontWeight="bold">{msg.sender}:</Text>
                <Text>{msg.message}</Text>
                <Text fontSize="xs" color="gray.500">
                  {new Date(msg.created_at).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>

          {/* Reply input */}
          <HStack mt={2}>
            <Input
              placeholder="Type a reply..."
              value={replyInputs[userId] || ""}
              onChange={(e) => handleReplyChange(userId, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendReply(userId)}
            />
            <Button colorScheme="yellow" onClick={() => sendReply(userId)}>
              Send
            </Button>
          </HStack>
        </Box>
      ))}
    </Box>
  );
}


