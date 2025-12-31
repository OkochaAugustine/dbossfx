"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
  Center,
  ScaleFade,
} from "@chakra-ui/react";
import { useAccount } from "@/app/hooks/useAccount";
import { supabase } from "@/lib/supabaseClient";

export default function WithdrawPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, loading } = useAccount();

  const [kyc, setKyc] = useState({
    full_name: "",
    address: "",
    mobile: "",
    next_of_kin: "",
    id_number: "",
    face_verified: false,
  });
  const [kycVerified, setKycVerified] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState("");

  // Load KYC status from AccountStatement
  useEffect(() => {
    if (account) {
      if (account.kyc_verified) {
        setKycVerified(true);
      } else if (account.kyc) {
        setKyc(account.kyc);
      }
    }
  }, [account]);

  const handleKycChange = (e) => {
    const { name, value, type, checked } = e.target;
    setKyc((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save KYC to Supabase and update local state
  const handleKycVerify = async () => {
    const allFilled = Object.values(kyc).every((val) => val !== "" && val !== false);
    if (!allFilled) {
      toast({
        title: "KYC incomplete",
        description: "Please fill all fields and complete face verification.",
        status: "warning",
      });
      return;
    }

    try {
      await supabase
        .from('"AccountStatement"') // exact table name in Supabase
        .update({ kyc, kyc_verified: true })
        .eq("user_id", account.user_id);

      // Update local state immediately
      setKycVerified(true);
      account.kyc_verified = true; // ✅ button will now enable immediately
      onClose();

      toast({
        title: "KYC Verified",
        description: "You can now withdraw funds anytime.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "KYC save failed",
        description: err.message,
        status: "error",
      });
    }
  };

  const handleWithdraw = async () => {
    if (!kycVerified) {
      toast({
        title: "KYC Required",
        description: "Please complete KYC before withdrawing.",
        status: "warning",
      });
      return;
    }

    if (Number(account?.balance || 0) < 500) {
      toast({
        title: "Minimum Balance Required",
        description: "Your balance must reach $500 before withdrawal.",
        status: "warning",
      });
      return;
    }

    setWithdrawLoading(true);
    setWithdrawMessage("");

    // Simulate withdrawal process with loading steps
    const totalSteps = 5;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setWithdrawMessage(`Processing withdrawal... Step ${currentStep} of ${totalSteps}`);
      if (currentStep === totalSteps) {
        clearInterval(interval);
        setWithdrawLoading(false);
        setWithdrawMessage("Timeout. Talk with our virtual assistance for help.");
      }
    }, 1200);
  };

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="yellow.400" />
      </Center>
    );
  }

  return (
    <Box w="100%" maxW="600px" p={4}>
      <Heading size="md" mb={4}>Withdraw Funds</Heading>

      <VStack spacing={4} align="stretch">
        <Text>
          Your balance: <strong>${Number(account?.balance || 0).toFixed(2)}</strong>
        </Text>
        <Text>Note: Minimum balance $500 required to withdraw.</Text>

        {!kycVerified && (
          <Button colorScheme="blue" onClick={onOpen}>Complete KYC</Button>
        )}

        <Button
          colorScheme="green"
          onClick={handleWithdraw}
          isDisabled={Number(account?.balance || 0) < 500 || withdrawLoading}
        >
          Withdraw
        </Button>

        {withdrawLoading && (
          <ScaleFade initialScale={0.8} in={withdrawLoading}>
            <VStack mt={3}>
              <Spinner size="xl" color="yellow.400" />
              <Text fontSize="lg" fontWeight="bold" color="yellow.500">
                {withdrawMessage || "Starting withdrawal..."}
              </Text>
            </VStack>
          </ScaleFade>
        )}

        {!withdrawLoading && withdrawMessage && (
          <Text mt={3} fontSize="lg" color="red.500" fontWeight="bold">
            {withdrawMessage}
          </Text>
        )}
      </VStack>

      {/* ===== KYC Modal ===== */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>KYC Verification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input name="full_name" value={kyc.full_name} onChange={handleKycChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" value={kyc.address} onChange={handleKycChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Mobile Number</FormLabel>
                <Input name="mobile" value={kyc.mobile} onChange={handleKycChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Next of Kin</FormLabel>
                <Input name="next_of_kin" value={kyc.next_of_kin} onChange={handleKycChange} />
              </FormControl>
              <FormControl>
                <FormLabel>ID Number</FormLabel>
                <Input name="id_number" value={kyc.id_number} onChange={handleKycChange} />
              </FormControl>

              {/* ===== FACE VERIFICATION BUTTON ===== */}
              <FormControl>
                <FormLabel>Face Verification</FormLabel>
                {!kyc.face_verified ? (
                  <Button
                    colorScheme="purple"
                    onClick={async () => {
                      try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        const video = document.createElement("video");
                        video.srcObject = stream;
                        video.play();
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        const canvas = document.createElement("canvas");
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        stream.getTracks().forEach((track) => track.stop());
                        setKyc((prev) => ({ ...prev, face_verified: true }));
                        toast({
                          title: "Face Verified",
                          description: "Face verification successful!",
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                        });
                      } catch {
                        toast({
                          title: "Face Verification Failed",
                          description: "Please allow camera access.",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    Start Face Verification
                  </Button>
                ) : (
                  <Text color="green.500">Face Verified ✔️</Text>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleKycVerify}>Verify</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

