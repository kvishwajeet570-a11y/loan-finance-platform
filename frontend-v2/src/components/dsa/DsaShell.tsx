"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DsaSidebar from "./DsaSidebar";

export default function DsaShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isKycPage =
    pathname === "/dsa/kyc" ||
    pathname.startsWith("/dsa/kyc/");

  return (
    <div className="min-h-screen bg-slate-50">
      <DsaSidebar />

      <main
        className={
          isKycPage
            ? "min-h-screen pl-0 lg:pl-[278px] transition-all duration-300"
            : "min-h-screen pl-0 lg:pl-[164px] transition-all duration-300"
        }
      >
        {children}
      </main>
    </div>
  );
}





