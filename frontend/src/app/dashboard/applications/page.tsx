import Sidebar from "@/components/dashboard/Sidebar";

import LoanApplications from "@/components/dashboard/LoanApplications";


export default function ApplicationsPage() {

  return (

    <div className="flex bg-[#020617] text-white min-h-screen">


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar activePage="Applications" />


      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">

          Loan Applications

        </h1>

        <LoanApplications />

      </div>

    </div>

  );

}