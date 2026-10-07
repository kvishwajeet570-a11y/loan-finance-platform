"use client";

import { MessageCircle, Move } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "ilf-whatsapp-position";

export default function FloatingWhatsApp() {
  const [pos, setPos] = useState({ x: 20, y: 500 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);

    if (saved) {
      try {
        setPos(JSON.parse(saved));
      } catch {}
    } else {
      setPos({
        x: Math.max(12, window.innerWidth - 78),
        y: Math.max(120, window.innerHeight - 150),
      });
    }
  }, []);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const x = Math.min(
      Math.max(8, e.clientX - 28),
      window.innerWidth - 64
    );

    const y = Math.min(
      Math.max(80, e.clientY - 28),
      window.innerHeight - 64
    );

    const next = { x, y };

    setPos(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <div
      className="fixed z-[99999] touch-none select-none"
      style={{
        left: pos.x,
        top: pos.y,
      }}
      onPointerMove={move}
    >
      <a
        href="https://wa.me/918292908077?text=Hello%20India%20Loan%20Finance%2C%20I%20would%20like%20to%20know%20more%20about%20your%20loan%20and%20financial%20services."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        className="group relative flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-700 text-white shadow-lg shadow-green-500/30 ring-4 ring-white/80 transition-all duration-200 hover:scale-110 active:cursor-grabbing"
      >
        <MessageCircle
          className="h-6 w-6"
          strokeWidth={2.6}
        />

        <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-green-300" />

        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-white shadow">
          <Move className="h-2.5 w-2.5" />
        </span>
      </a>
    </div>
  );
}
