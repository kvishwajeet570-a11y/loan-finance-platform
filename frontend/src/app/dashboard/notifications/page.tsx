import Sidebar from "../../../components/dashboard/Sidebar";

import DashboardNotifications from "../../../components/dashboard/DashboardNotifications";


export default function NotificationsPage() {

  return (

    <div className="flex bg-[#020617] text-white min-h-screen">


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar activePage="Notifications" />


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">

          Notifications

        </h1>

        <DashboardNotifications />

      </div>

    </div>

  );

}