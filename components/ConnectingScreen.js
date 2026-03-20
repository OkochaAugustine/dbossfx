// components/ConnectingScreen.jsx
import { useEffect } from "react";

export default function ConnectingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // navigate to login/dashboard
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-white text-center animate-fadeIn">
      <h1 className="text-3xl font-semibold mb-4 animate-pulse">Please hold…</h1>
      <p className="text-lg">Connecting your account</p>
      <div className="mt-8 animate-bounce">
        <div className="h-6 w-6 bg-white rounded-full"></div>
      </div>
    </div>
  );
}