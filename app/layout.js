import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LoadingProvider } from "@/components/context/LoadingContext";
import LoaderGate from "@/components/LoaderGate";
import RouteListener from "@/components/RouteListener";
import LayoutShell from "@/components/LayoutClient";
import GlobalChat from "@/components/GlobalChat"; // ✅ imported

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          overflowX: "hidden",
          width: "100vw",
          minWidth: 0,
        }}
      >
        <LoadingProvider>
          <Providers>
            <RouteListener />
            <LoaderGate />
            <LayoutShell>
              {children}
              <GlobalChat /> {/* ✅ chat appears globally */}
            </LayoutShell>
          </Providers>
        </LoadingProvider>
      </body>
    </html>
  );
}

