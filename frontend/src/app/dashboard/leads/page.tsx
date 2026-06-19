import Sidebar from "../../../components/dashboard/Sidebar";

import MyLeads from "../../../components/dashboard/MyLeads";


export default function LeadsPage() {

  return (

    <div className="flex bg-[#020617] text-white min-h-screen">


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar activePage="My Leads" />


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">

          My Leads

        </h1>

        <MyLeads />

      </div>

    </div>

  );

}