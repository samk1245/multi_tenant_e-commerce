import React, { useState, useEffect } from 'react';
import { Sparkles, Globe2, ShieldCheck, Zap } from 'lucide-react';

export default function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const statusMessages = [
    'Initializing Spatial Engine...',
    'Mounting 14 Flagship Storefronts...',
    'Calibrating 3D Physics & Micro-Interactions...',
    'Securing Multi-Tenant Scopes...',
    'Experience Ready',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = Math.floor(Math.random() * 14) + 12;
        const next = Math.min(100, prev + increment);
        const nextIdx = Math.min(
          statusMessages.length - 1,
          Math.floor((next / 100) * statusMessages.length)
        );
        setStatusIndex(nextIdx);
        return next;
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 400);

      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Cosmic Atmosphere */}
      <div className="absolute inset-0 bg-cosmic-grid opacity-20 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Center 3D Holographic Sphere & Orbital Rings */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          {/* Outer Rotating Cyan Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 animate-radar"
            style={{ animationDuration: '8s' }}
          />

          {/* Inner Counter-Rotating Purple Ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-purple-500/30 border-l-transparent animate-radar"
            style={{ animationDirection: 'reverse', animationDuration: '5s' }}
          />

          {/* Core Glowing Orb */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.6)] animate-pulse">
            <span className="text-2xl font-black text-white tracking-tighter">S</span>
          </div>

          {/* Floating Sparkle Micro-Badges */}
          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-cyan-400/20 border border-cyan-300/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          </div>
        </div>

        {/* Brand Name Typography */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-2">
          <span>SHOPSPHERE</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono uppercase tracking-widest">
            3D 2.0
          </span>
        </h1>
        <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase mb-6">
          Cinematic Multi-Tenant Commerce Experience
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full bg-neutral-900/90 rounded-full h-2 p-0.5 border border-white/10 mb-3 shadow-inner overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(139,92,246,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Message & Percent */}
        <div className="w-full flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span className="flex items-center gap-1.5 text-neutral-300 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            {statusMessages[statusIndex]}
          </span>
          <span className="font-bold text-white ml-2">{progress}%</span>
        </div>

        {/* Skip button for instantaneous access */}
        <button
          onClick={handleSkip}
          className="mt-8 text-[11px] text-neutral-500 hover:text-neutral-300 transition underline underline-offset-4 cursor-pointer"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
}
