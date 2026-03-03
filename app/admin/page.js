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
  const [deletingId, setDeletingId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  // ------------------- AUTH FETCH -------------------
  const authFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  };

  // ------------------- VERIFY ADMIN -------------------
  const verifyToken = async () => {
    try {
      const res = await authFetch("/api/admin/verify-token");
      const data = await res.json();
      if (!res.ok || !data.valid) throw new Error("Auth failed");
      await fetchAccounts();
    } catch (err) {
      toast({
        title: "Authentication error",
        description: "Please login again.",
        status: "error",
      });
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // ------------------- FETCH ACCOUNTS -------------------
  const fetchAccounts = async () => {
    try {
      console.log("📡 Fetching accounts...");
      const res = await authFetch("/api/admin/getAccounts");
      const result = await res.json();
      console.log("📨 getAccounts response:", result);

      if (!res.ok || !result.success)
        throw new Error(result.error || "Failed to fetch accounts");

      // ✅ Use result.data, format properly
      setAccounts(
        result.data.map((acc) => ({
          user_id: acc.user_id,
          full_name: acc.full_name,
          email: acc.email,
          phone: acc.phone,
          account_id: acc.account_id,
          balance: acc.balance ?? 0,
          earned_profit: acc.earned_profit ?? 0,
          active_deposit: acc.active_deposit ?? 0,
        }))
      );
    } catch (err) {
      console.error("🚨 Error fetching accounts:", err);
      toast({
        title: "Error fetching accounts",
        description: err.message,
        status: "error",
      });
    }
  };

  // ------------------- REALTIME USER INSERT -------------------
  useEffect(() => {
    const channel = supabase
      .channel("admin-users-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        async () => {
          console.log("🆕 New user inserted, refetching accounts...");
          await fetchAccounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ------------------- SAVE ACCOUNT -------------------
  const handleSave = async (account) => {
    setSavingId(account.user_id);

    try {
      const isNew = !account.account_id;
      const url = isNew
        ? "/api/admin/createAccount"
        : "/api/admin/updateAccount";

      const bodyData = isNew
        ? {
            user_id: account.user_id,
            balance: Number(account.balance),
            earned_profit: Number(account.earned_profit),
            active_deposit: Number(account.active_deposit),
          }
        : {
            id: account.account_id,
            balance: Number(account.balance),
            earned_profit: Number(account.earned_profit),
            active_deposit: Number(account.active_deposit),
          };

      console.log("💾 Saving account:", bodyData);

      const res = await authFetch(url, {
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();
      console.log("📨 Save account response:", result);

      if (!res.ok || !result.success)
        throw new Error(result.error || "Failed to save account");

      toast({
        title: `Account ${isNew ? "created" : "updated"}`,
        status: "success",
      });
    } catch (err) {
      console.error("🚨 Save account error:", err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
      });
    } finally {
      setSavingId(null);
    }
  };

  // ------------------- DELETE USER -------------------
  const handleDeleteUser = async (userId) => {
    const confirmDelete = confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!confirmDelete) return;

    setDeletingId(userId);

    try {
      const res = await authFetch("/api/admin/deleteUser", {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.error || "Failed to delete user");

      console.log("🗑️ User deleted:", userId);

      setAccounts((prev) => prev.filter((a) => a.user_id !== userId));
      setMessages((prev) => prev.filter((m) => m.user_id !== userId));

      toast({
        title: "User deleted successfully",
        status: "success",
      });
    } catch (err) {
      console.error("🚨 Delete user error:", err);
      toast({
        title: "Delete failed",
        description: err.message,
        status: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ------------------- SUPPORT -------------------
  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      try {
        console.log("📡 Fetching support messages...");
        const { data, error } = await supabase
          .from("support_messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("❌ Fetch support_messages failed:", error);
          return;
        }

        console.log("✅ Loaded messages:", data.length);
        if (mounted) setMessages(data || []);
      } catch (err) {
        console.error("🚨 Error fetching support_messages:", err);
      }
    };

    loadMessages();

    const channel = supabase
      .channel("support-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages" },
        (payload) => {
          console.log("📨 New support message received:", payload.new);
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
      console.log(`✉️ Sending reply to ${userId}:`, message);
      const { data, error } = await supabase.from("support_messages").insert({
        user_id: userId,
        sender: "admin",
        message,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("❌ Failed to send reply:", error);
        return;
      }

      console.log("✅ Reply sent:", data);
      setReplyInputs((prev) => ({ ...prev, [userId]: "" }));
    } catch (err) {
      console.error("🚨 Error sending reply:", err);
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
    <Box p={[4, 6, 8]} maxW="100vw">
      <Heading mb={6}>Admin Dashboard</Heading>

      {/* ACCOUNTS TABLE */}
      <Box overflowX="auto" mb={10}>
        <Table size="sm" minW="1000px">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Balance</Th>
              <Th>Profit</Th>
              <Th>Deposit</Th>
              <Th>Actions</Th>
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
                      setAccounts((prev) =>
                        prev.map((a) =>
                          a.user_id === acc.user_id
                            ? { ...a, balance: e.target.value }
                            : a
                        )
                      )
                    }
                  />
                </Td>

                <Td>
                  <Input
                    size="sm"
                    type="number"
                    value={acc.earned_profit}
                    onChange={(e) =>
                      setAccounts((prev) =>
                        prev.map((a) =>
                          a.user_id === acc.user_id
                            ? { ...a, earned_profit: e.target.value }
                            : a
                        )
                      )
                    }
                  />
                </Td>

                <Td>
                  <Input
                    size="sm"
                    type="number"
                    value={acc.active_deposit}
                    onChange={(e) =>
                      setAccounts((prev) =>
                        prev.map((a) =>
                          a.user_id === acc.user_id
                            ? { ...a, active_deposit: e.target.value }
                            : a
                        )
                      )
                    }
                  />
                </Td>

                <Td>
                  <HStack>
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      isLoading={savingId === acc.user_id}
                      onClick={() => handleSave(acc)}
                    >
                      Save
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="red"
                      isLoading={deletingId === acc.user_id}
                      onClick={() => handleDeleteUser(acc.user_id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Divider my={6} />

      {/* SUPPORT CHAT */}
      <Heading size="md" mb={4}>
        Live Support Messages
      </Heading>

      {Object.entries(groupedMessages).map(([userId, msgs]) => (
        <Box
          key={userId}
          mb={6}
          p={4}
          border="1px solid"
          borderColor="gray.200"
          rounded="xl"
        >
          <Text fontWeight="bold" mb={2}>
            User ID: {userId}
          </Text>

          <VStack align="stretch" spacing={2}>
            {msgs.map((m) => (
              <Box
                key={m.id}
                p={2}
                bg={m.sender === "user" ? "yellow.100" : "gray.200"}
                rounded="md"
              >
                <Text fontSize="sm" fontWeight="bold">
                  {m.sender}
                </Text>
                <Text fontSize="sm">{m.message}</Text>
              </Box>
            ))}
          </VStack>

          <HStack mt={3}>
            <Input
              placeholder="Reply..."
              size="sm"
              value={replyInputs[userId] || ""}
              onChange={(e) =>
                setReplyInputs((p) => ({ ...p, [userId]: e.target.value }))
              }
            />
            <Button
              size="sm"
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