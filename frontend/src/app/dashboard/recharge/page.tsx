"use client";

import RechargeForm from "@/components/dashboard/RechargeForm";

import RechargeHistory from "@/components/dashboard/RechargeHistory";


export default function RechargePage() {

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">

        Recharge Dashboard

      </h1>

      <RechargeForm />

      <RechargeHistory />

    </div>

  );

}