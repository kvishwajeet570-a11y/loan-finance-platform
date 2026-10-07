"use client";

import { ReactNode } from "react";
import DsaSidebar from "./DsaSidebar";

export default function DsaShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DsaSidebar />
      <main className="min-h-screen pl-0 lg:pl-[270px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
