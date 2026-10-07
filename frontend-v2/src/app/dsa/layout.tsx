"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function DsaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DsaShell>{children}</DsaShell>;
}
