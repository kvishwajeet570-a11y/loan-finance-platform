import { redirect } from "next/navigation";

export default function TransactionsPage() {
  redirect("/customer/transactions/all");
}
