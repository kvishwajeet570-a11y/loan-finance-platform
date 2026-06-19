import Sidebar from "../../../components/dashboard/Sidebar";

import Leaderboard from "../../../components/dashboard/Leaderboard";


export default function LeaderboardPage() {

  return (

    <div className="flex bg-[#020617] text-white min-h-screen">


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar activePage="Leaderboard" />


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">

          Leaderboard

        </h1>

        <Leaderboard />

      </div>

    </div>

  );

}