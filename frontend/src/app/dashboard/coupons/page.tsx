"use client";

import CouponCard from "@/components/dashboard/CouponCard";

import ApplyCoupon from "@/components/dashboard/ApplyCoupon";


export default function CouponsPage() {

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">

        Coupons Dashboard

      </h1>

      <ApplyCoupon />

      <CouponCard />

    </div>

  );

}