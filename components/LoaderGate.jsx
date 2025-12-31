"use client";

import { useLoading } from "@/components/context/LoadingContext";
import GlobalLoader from "@/components/GlobalLoader";

export default function LoaderGate() {
  const { loading, type } = useLoading();

  if (!loading) return null;

  return <GlobalLoader type={type} />;
}
