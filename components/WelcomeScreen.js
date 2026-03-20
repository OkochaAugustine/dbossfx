// components/WelcomeScreen.jsx
import { useEffect } from "react";

export default function WelcomeScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-500 flex flex-col justify-center items-center text-white text-center overflow-hidden animate-fadeIn">
      {/* Confetti bubbles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/70 rounded-full w-2 h-2 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main message */}
      <h1 className="text-5xl font-extrabold mb-4 animate-bounce">🎉 Congratulations! 🎉</h1>
      <p className="text-2xl font-semibold mb-8">Welcome to <span className="text-yellow-300">DbossFX</span>!</p>

      {/* Glowing spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin glow-shadow"></div>
        <div className="absolute inset-0 rounded-full border-4 border-white/50 border-t-transparent animate-spin animate-spin-reverse"></div>
      </div>

      <p className="text-lg animate-pulse">Loading your dashboard...</p>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-20px) }
          100% { transform: translateY(0px) }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-reverse { animation: spin 1s linear infinite reverse; }
        .glow-shadow { box-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}