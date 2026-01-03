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
      };
    }
  }, []);

  return <div id="google_translate_element" />;
}
