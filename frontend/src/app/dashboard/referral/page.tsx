"use client";

import ReferralCard from "@/components/dashboard/ReferralCard";

import ReferralRewards from "@/components/dashboard/ReferralRewards";


export default function ReferralPage() {

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">

        Referral Dashboard

      </h1>

      <ReferralCard />

      <ReferralRewards />

    </div>

  );

}