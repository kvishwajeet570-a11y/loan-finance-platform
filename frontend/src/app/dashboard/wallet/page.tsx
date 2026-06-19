"use client";

import WalletCard from "@/components/dashboard/WalletCard";

import WalletTransactions from "@/components/dashboard/WalletTransactions";

import AddMoneyModal from "@/components/dashboard/AddMoneyModal";


export default function WalletPage() {

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">

        Wallet Dashboard

      </h1>

      <WalletCard />

      <AddMoneyModal />

      <WalletTransactions />

    </div>

  );

}