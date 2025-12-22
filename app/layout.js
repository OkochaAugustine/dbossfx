import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "DbossFX | Trade Smart. Trade Global.",
  description: "Professional Forex Broker Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Providers MUST wrap everything that uses Chakra */}
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
