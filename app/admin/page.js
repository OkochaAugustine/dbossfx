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
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const toast = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ NEW
  const [accounts, setAccounts] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  // ------------------- FETCH HELPER -------------------
  const authFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
  };

  // ✅ ADMIN AUTH CHECK
  const checkAdmin = async () => {
    try {
      const res = await fetch("/api/admin/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        router.replace("/admin/login");
        return false;
      }

      setIsAdmin(true);
      return true;
    } catch (err) {
      router.replace("/admin/login");
      return false;
    }
  };

  // ------------------- INITIAL LOAD -------------------
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const ok = await checkAdmin(); // ✅ PROTECT

        if (!ok) return;

        await fetchAccounts();
        await fetchMessages();
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ------------------- FETCH ACCOUNTS -------------------
  const fetchAccounts = async () => {
    try {
      const res = await authFetch("/api/admin/getAccounts");
      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.error || "Failed to fetch accounts");

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
      toast({ title: "Error fetching accounts", description: err.message, status: "error" });
    }
  };

  // ------------------- SAVE ACCOUNT -------------------
  const handleSave = async (account) => {
    setSavingId(account.user_id);
    try {
      const isNew = !account.account_id;
      const url = isNew ? "/api/admin/createAccount" : "/api/admin/updateAccount";
      const bodyData = isNew
        ? { user_id: account.user_id, balance: Number(account.balance), earned_profit: Number(account.earned_profit), active_deposit: Number(account.active_deposit) }
        : { id: account.account_id, balance: Number(account.balance), earned_profit: Number(account.earned_profit), active_deposit: Number(account.active_deposit) };

      const res = await authFetch(url, { method: "POST", body: JSON.stringify(bodyData) });
      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.error || "Failed to save account");

      toast({ title: `Account ${isNew ? "created" : "updated"}`, status: "success" });
      await fetchAccounts();
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    } finally {
      setSavingId(null);
    }
  };

  // ------------------- DELETE USER -------------------
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    setDeletingId(userId);
    try {
      const res = await authFetch("/api/admin/deleteUser", { method: "POST", body: JSON.stringify({ user_id: userId }) });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || "Failed to delete user");

      toast({ title: "User deleted successfully", status: "success" });
      await fetchAccounts();
    } catch (err) {
      toast({ title: "Delete failed", description: err.message, status: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  // ------------------- SUPPORT MESSAGES -------------------
  const fetchMessages = async () => {
    try {
      const res = await authFetch("/api/mongo/support?admin=true");
      const result = await res.json();

      if (res.ok && result.success) {
        setMessages(result.messages.filter((m) => m.userId));
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const sendReply = async (userId) => {
    const message = replyInputs[userId]?.trim();
    if (!message || !userId) return;

    try {
      const res = await authFetch("/api/mongo/support", {
        method: "POST",
        body: JSON.stringify({
          userId,
          sender: "admin",
          message,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.error || "Failed to send message");

      setReplyInputs((prev) => ({ ...prev, [userId]: "" }));
      await fetchMessages();
    } catch (err) {
      toast({ title: "Failed to send message", description: err.message, status: "error" });
    }
  };

  // ------------------- LOADING -------------------
  if (loading || !isAdmin) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="yellow.400" />
      </Center>
    );
  }

  // ------------------- GROUP MESSAGES -------------------
  const groupedMessages = messages.reduce((acc, msg) => {
    const id = msg.userId;
    acc[id] = acc[id] || [];
    acc[id].push(msg);
    return acc;
  }, {});

  // ------------------- RENDER -------------------
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
                          a.user_id === acc.user_id ? { ...a, balance: e.target.value } : a
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
                          a.user_id === acc.user_id ? { ...a, earned_profit: e.target.value } : a
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
                          a.user_id === acc.user_id ? { ...a, active_deposit: e.target.value } : a
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

      {/* SUPPORT */}
      <Heading size="md" mb={4}>
        Live Support Messages
      </Heading>

      {Object.entries(groupedMessages).map(([userId, msgs]) => (
        <Box key={userId} mb={6} p={4} border="1px solid" rounded="xl">
          <Text fontWeight="bold" mb={2}>
            User ID: {userId}
          </Text>

          <VStack align="stretch" spacing={2}>
            {msgs.map((m) => (
              <Box
                key={m._id || m.id}
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
            <Button size="sm" colorScheme="yellow" onClick={() => sendReply(userId)}>
              Send
            </Button>
          </HStack>
        </Box>
      ))}
    </Box>
  );
}