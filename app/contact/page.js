"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon, InfoIcon } from "@chakra-ui/icons";
import GlobalChat from "@/components/GlobalChat"; // Import your chat bot

export default function ContactPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state (optional, if you still want the form)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    // Optional: submit form data to backend
    onOpen(); // Open modal after form submit
  };

  const handleModalOk = () => {
    onClose();
    setChatOpen(true); // Open the GlobalChat
    // Optional: notify app/layout via event (if chat is centralized)
    window.dispatchEvent(new CustomEvent("open-global-chat"));
  };

  return (
    <Box bg="gray.50" minH="100vh">
      {/* ===== HERO ===== */}
      <Box
        bgImage="url('/images/contact-bg.png')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
        py={{ base: 20, md: 40 }}
      >
        <Box position="absolute" inset="0" bg="blackAlpha.600" /> {/* overlay */}
        <Stack
          position="relative"
          zIndex={2}
          maxW="1200px"
          mx="auto"
          spacing={6}
          textAlign="center"
          color="white"
          px={4}
        >
          <Heading fontSize={{ base: "3xl", md: "5xl" }}>Contact Us</Heading>
          <Text fontSize={{ base: "md", md: "lg" }}>
            We're here to answer your questions and help you get started.
          </Text>
          <Button
            size="lg"
            colorScheme="yellow"
            w="fit-content"
            mx="auto"
            onClick={onOpen} // Open modal instead of directly opening chat
          >
            Get in Touch Today
          </Button>
        </Stack>
      </Box>

      {/* ===== CONTACT INFO & FORM (optional) ===== */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <SimpleGrid
          maxW="1200px"
          mx="auto"
          columns={{ base: 1, md: 2 }}
          spacing={16}
        >
          {/* Contact Info */}
          <VStack align="start" spacing={6}>
            <Heading size="xl">Reach Out To Us</Heading>
            <Text color="gray.600" fontSize="lg">
              Have questions or need support? Our team is ready to assist you.
            </Text>
            <HStack spacing={4}>
              <Icon as={PhoneIcon} w={6} h={6} color="yellow.400" />
              <Text fontSize="lg">+123 456 7890</Text>
            </HStack>
            <HStack spacing={4}>
              <Icon as={EmailIcon} w={6} h={6} color="yellow.400" />
              <Text fontSize="lg">support@dbossfx.com</Text>
            </HStack>
            <HStack spacing={4}>
              <Icon as={InfoIcon} w={6} h={6} color="yellow.400" />
              <Text fontSize="lg">Mon - Fri, 9AM - 6PM</Text>
            </HStack>
          </VStack>

          {/* Contact Form (optional) */}
          <VStack
            as="form"
            spacing={4}
            bg="white"
            p={10}
            rounded="2xl"
            shadow="xl"
            w="100%"
            onSubmit={handleSend}
          >
            <Input
              placeholder="Full Name"
              size="lg"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Email Address"
              size="lg"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Phone Number"
              size="lg"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Textarea
              placeholder="Your Message"
              size="lg"
              rows={6}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <Button colorScheme="yellow" size="lg" w="full" type="submit">
              Send Message
            </Button>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* ===== LOCATION MAP (Optional) ===== */}
      <Box mt={12}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799143366!2d-74.259865949853!3d40.697670067014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5c2c6c9c1%3A0x8f6e4f8fdfd1e7!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </Box>

      {/* ===== CTA ===== */}
      <Box bg="black" color="white" py={{ base: 16, md: 24 }} px={4}>
        <Stack maxW="900px" mx="auto" textAlign="center" spacing={6}>
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Ready to Start Trading?
          </Heading>
          <Text color="gray.300">
            Join traders worldwide using professional-grade trading solutions.
          </Text>
          <Button size="lg" colorScheme="yellow" px={12}>
            Open Live Account
          </Button>
        </Stack>
      </Box>

      {/* ===== CHAT MODAL ===== */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bgGradient="linear(to-r, yellow.400, yellow.500)"
          p={8}
          rounded="3xl"
          textAlign="center"
        >
          <ModalBody>
            <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4} color="white">
              Please Chat Now
            </Heading>
            <Text fontSize="lg" mb={6} color="whiteAlpha.900">
              Our support team is ready to help you instantly via our chat assistant.
            </Text>
            <Button colorScheme="blackAlpha" size="lg" px={10} py={6} onClick={handleModalOk}>
              Open Chat
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ===== GLOBAL CHAT ===== */}
      {chatOpen && <GlobalChat forceOpen={true} />}
    </Box>
  );
}
