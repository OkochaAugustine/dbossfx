"use client";
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    if (!window.google || !window.google.translate) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );

        // ✅ Optional: reduce the widget size via transform
        const iframe = document.querySelector("#google_translate_element iframe");
        if (iframe) {
          iframe.style.transform = "scale(0.8)";
          iframe.style.transformOrigin = "top left";
          iframe.style.height = "30px"; // control exact height
        }
      };
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        overflow: "hidden",
        height: "30px", // same height as iframe
        lineHeight: 0, // remove extra spacing
      }}
    />
  );
}