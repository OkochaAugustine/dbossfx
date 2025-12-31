"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/components/context/LoadingContext";

export default function RouteListener() {
  const pathname = usePathname();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return null;
}
