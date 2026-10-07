"use client";

import React, { useState } from "react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

export default function CustomerShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-[88px]" : "lg:pl-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
