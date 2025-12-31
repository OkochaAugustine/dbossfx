"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Button,
  Divider,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import LiveChart from "./components/LiveChart";
import AccountStatement from "./components/AccountStatement";
import StartTrading from "./components/startTrading";
import News from "./news";
import HistoryPage from "@/app/history/page";
import Settings from "@/app/dashboard/settings"; // updated path
import WithdrawPage from "./withdraw/page"; // ✅ Withdraw page
import DepositPage from "./deposit/page";   // ✅ Deposit page
import ChatPage from "./chat/page";         // ✅ Chat bot page
import { supabase } from "@/lib/supabaseClient";

// ✅ IMPORT LOADING SCREEN
import LoadingScreen from "@/components/LoadingScreen";
import { useLoading } from "@/components/context/LoadingContext";

export default function DashboardPage() {
  const { loading, type } = useLoading(); // ✅ useLoading context
  const [mobileOpen, setMobileOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (user) setUserId(user.id);
      setLoadingUser(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUserId(session?.user?.id || null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const links = ["dashboard", "news", "history", "settings", "chat"];

  return (
    <Flex
      h="100vh"
      w="100vw"
      overflow="hidden"
      direction={{ base: "column", md: "row" }}
    >
      {/* ================= DESKTOP SIDEBAR ================= */}
      <VStack
        display={{ base: "none", md: "flex" }}
        w="250px"
        flexShrink={0}
        bg="url('/images/side-bg.png')"
        bgSize="cover"
        bgPos="center"
        p={6}
        spacing={4}
        align="stretch"
      >
        {!loadingUser && userId && (
          <Box>
            <AccountStatement userId={userId} isCompact />
          </Box>
        )}

        {links.map((p) => (
          <Button
            key={p}
            variant="ghost"
            justifyContent="flex-start"
            color="white"
            onClick={() => setActiveView(p)}
          >
            {p.toUpperCase()}
          </Button>
        ))}

        <Divider borderColor="whiteAlpha.500" />

        <HStack spacing={2}>
          <Button
            colorScheme="yellow"
            flex="1"
            onClick={() => setActiveView("deposit")}
          >
            Deposit
          </Button>
          <Button
            colorScheme="yellow"
            variant="outline"
            flex="1"
            onClick={() => setActiveView("withdraw")}
          >
            Withdraw
          </Button>
        </HStack>

        <IconButton
          aria-label="Mute"
          icon={muted ? <ViewOffIcon /> : <ViewIcon />}
          onClick={() => setMuted(!muted)}
        />
      </VStack>

      {/* ================= MOBILE HEADER ================= */}
      <Flex
        display={{ base: "flex", md: "none" }}
        p={2}
        bg="url('/images/side-bg.png')"
        bgSize="cover"
        bgPos="center"
        align="center"
        gap={2}
      >
        <Button size="sm" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? "✕ Close" : "☰ Menu"}
        </Button>

        {!loadingUser && userId && (
          <Box flex="1" overflow="hidden">
            <AccountStatement userId={userId} isCompact mobile />
          </Box>
        )}
      </Flex>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileOpen && (
        <VStack
          display={{ base: "flex", md: "none" }}
          bg="url('/images/side-bg.png')"
          bgSize="cover"
          bgPos="center"
          p={4}
          spacing={3}
          align="stretch"
        >
          {links.map((p) => (
            <Button
              key={p}
              variant="ghost"
              justifyContent="flex-start"
              color="white"
              onClick={() => {
                setActiveView(p);
                setMobileOpen(false);
              }}
            >
              {p.toUpperCase()}
            </Button>
          ))}

          <HStack spacing={2}>
            <Button
              colorScheme="yellow"
              flex="1"
              onClick={() => {
                setActiveView("deposit");
                setMobileOpen(false);
              }}
            >
              Deposit
            </Button>
            <Button
              colorScheme="yellow"
              variant="outline"
              flex="1"
              onClick={() => {
                setActiveView("withdraw");
                setMobileOpen(false);
              }}
            >
              Withdraw
            </Button>
          </HStack>
        </VStack>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* ✅ SHOW LOADING SCREEN IF dashboard type */}
        {loading && type === "dashboard" && <LoadingScreen type="dashboard" />}

        <Box flex="1" p={{ base: 2, md: 6 }} overflow="auto">
          {!loadingUser && userId ? (
            <>
              {activeView === "dashboard" && (
                <>
                  <HStack mb={3}>
                    <Button
                      colorScheme="green"
                      flex="1"
                      onClick={() => setActiveView("startTrading")}
                    >
                      Start Trading
                    </Button>
                    <Button colorScheme="blue" flex="1">
                      Create Demo Account
                    </Button>
                  </HStack>
                  <LiveChart fetchUrl="/api/market" userId={userId} />
                </>
              )}

              {activeView === "startTrading" && <StartTrading userId={userId} />}
              {activeView === "news" && <News />}
              {activeView === "history" && <HistoryPage />}
              {activeView === "settings" && <Settings />}
              {activeView === "withdraw" && <WithdrawPage userId={userId} />}
              {activeView === "deposit" && <DepositPage userId={userId} />}
              {activeView === "chat" && <ChatPage />} {/* ✅ Chat bot */}
            </>
          ) : (
            <Flex h="60vh" align="center" justify="center">
              <Text>Loading user data...</Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
