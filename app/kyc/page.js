"use client";

import { useState, useRef } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function KycPage() {
  const [kycData, setKycData] = useState({
    fullName: "",
    dob: "",
    country: "",
    idType: "",
    idNumber: "",
    idFile: null,
    faceImage: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setKycData({ ...kycData, [name]: files[0] });
    else setKycData({ ...kycData, [name]: value });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Unable to access webcam",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setKycData({ ...kycData, faceImage: blob });
      toast({
        title: "Face Captured",
        description: "Face image successfully captured.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, "image/jpeg");
  };

  const handleSubmit = async () => {
    if (!kycData.faceImage || !kycData.idFile) {
      toast({
        title: "Missing Information",
        description: "Please upload ID and capture your face.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <VStack p={6} spacing={6} align="stretch" maxW="600px" mx="auto">
      <Heading>KYC Verification</Heading>

      {success ? (
        <Text color="green.500" fontWeight="bold">
          KYC submitted successfully! We will verify your documents soon.
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input name="fullName" value={kycData.fullName} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Date of Birth</FormLabel>
            <Input type="date" name="dob" value={kycData.dob} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Country</FormLabel>
            <Select name="country" value={kycData.country} onChange={handleChange}>
              <option value="">Select country</option>
              <option value="Nigeria">Nigeria</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>ID Type</FormLabel>
            <Select name="idType" value={kycData.idType} onChange={handleChange}>
              <option value="">Select ID type</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
              <option value="National ID">National ID</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>ID Number</FormLabel>
            <Input name="idNumber" value={kycData.idNumber} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Upload ID</FormLabel>
            <Input type="file" name="idFile" onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Face Verification</FormLabel>
            <Box mb={2}>
              <video
                ref={videoRef}
                width="100%"
                height="240"
                autoPlay
                style={{ borderRadius: "12px", border: "1px solid #ccc" }}
              />
              <canvas
                ref={canvasRef}
                width="400"
                height="240"
                style={{ display: "none" }}
              />
            </Box>
            <Button colorScheme="yellow" onClick={startCamera} mb={2}>
              Start Camera
            </Button>
            <Button colorScheme="green" onClick={captureFace}>
              Capture Face
            </Button>
          </FormControl>

          <Button
            colorScheme="yellow"
            onClick={handleSubmit}
            isLoading={submitting}
          >
            Submit KYC
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
