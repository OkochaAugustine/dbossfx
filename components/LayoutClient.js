"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";



export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {/* Navbar is always shown */}
      <Navbar />

      <div style={{ width: "100%", minWidth: 0, overflowX: "hidden" }}>
        {children}
      </div>

      {/* Footer only on non-dashboard pages */}
      {!isDashboard && <Footer />}
    </>
  );
}

