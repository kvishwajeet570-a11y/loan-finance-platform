import Sidebar from "@/components/dashboard/Sidebar";

import CommissionCard from "@/components/dashboard/CommissionCard";


export default function CommissionPage() {

  return (

    <div className="flex bg-[#020617] text-white min-h-screen">


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar activePage="Commission" />


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">

          Commission

        </h1>

        <CommissionCard />

      </div>

    </div>

  );

}