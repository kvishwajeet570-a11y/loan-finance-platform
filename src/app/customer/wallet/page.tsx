import { redirect } from "next/navigation";

export default function WalletPage() {
  redirect("/customer/wallet/balance");
}
