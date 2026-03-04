import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LoadingProvider } from "@/components/context/LoadingContext";
import LoaderGate from "@/components/LoaderGate";
import RouteListener from "@/components/RouteListener";
import LayoutShell from "@/components/LayoutClient";
import GlobalChat from "@/components/GlobalChat";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflowX: "hidden", width: "100vw", minWidth: 0 }}>
        {/* Google Translate Script */}
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'en,fr,de,es,it,pt,ar,zh-CN,ru',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                'google_translate_element'
              );
            }
          `}
        </Script>

        <LoadingProvider>
          <Providers>
            <RouteListener />
            <LoaderGate />
            <LayoutShell>
              {children}
              <GlobalChat />
            </LayoutShell>
          </Providers>
        </LoadingProvider>
      </body>
    </html>
  );
}