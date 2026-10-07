import type { ReactNode } from "react";
import DsaShell from "@/components/dsa/DsaShell";

export default function DsaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DsaShell>{children}</DsaShell>;
}
