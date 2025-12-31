"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=forex OR crypto OR stocks OR bitcoin OR market&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`
        );

        const data = await res.json();

        if (data.status === "ok" && data.articles?.length > 0) {
          setArticles(data.articles);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error("News fetch failed:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_KEY]);

  return (
    <Flex
      minH="100vh"
      w="100%"
      bgImage="url('/images/news-bg.jpg')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      p={{ base: 4, md: 8 }}
      position="relative"
    >
      {/* Dark overlay */}
      <Box
        position="absolute"
        inset={0}
        bg="blackAlpha.700"
        zIndex={0}
      />

      <VStack
        spacing={6}
        w="100%"
        maxW="4xl"
        mx="auto"
        zIndex={1}
      >
        <Heading color="yellow.400" textAlign="center">
          Live Market News
        </Heading>

        <Text color="gray.200" textAlign="center">
          Real-time Forex, Crypto & Stock market updates
        </Text>

        {loading ? (
          <Spinner size="xl" color="yellow.400" />
        ) : articles.length === 0 ? (
          <Text color="white">
            No news available right now. Please refresh shortly.
          </Text>
        ) : (
          articles.map((item, idx) => (
            <Box
              key={idx}
              bg="whiteAlpha.900"
              rounded="2xl"
              p={5}
              w="100%"
              shadow="xl"
            >
              <ChakraLink href={item.url} isExternal>
                <Heading size="md" color="black">
                  {item.title}
                </Heading>
              </ChakraLink>

              {item.description && (
                <Text mt={2} color="gray.700">
                  {item.description}
                </Text>
              )}

              <Text mt={3} fontSize="sm" color="gray.500">
                Source: {item.source?.name || "Market News"}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Flex>
  );
}
