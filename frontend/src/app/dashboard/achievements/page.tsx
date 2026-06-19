import Sidebar from "../../../components/dashboard/Sidebar";

import Achievements from "../../../components/dashboard/Achievements";


export default function AchievementsPage() {

  return (

    <div className="flex bg-[#020617] text-white min-h-screen">


      {/* SIDEBAR */}

      <Sidebar activePage="Achievements" />


      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">

          Achievements

        </h1>

        <Achievements />

      </div>

    </div>

  );

}