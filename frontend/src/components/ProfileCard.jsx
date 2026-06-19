export default function ProfileCard() {

  return (

    <section className="py-20 bg-[#020617] text-white">

      <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,255,0.1)]">

        {/* PROFILE IMAGE */}

        <div className="flex justify-center">

          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-5xl font-bold">

            P

          </div>

        </div>


        {/* USER INFO */}

        <div className="text-center mt-8">

          <h2 className="text-4xl font-bold">
            Pritam Prakash
          </h2>

          <p className="text-gray-400 mt-3">
            pritam@example.com
          </p>

        </div>


        {/* DETAILS */}

        <div className="mt-10 space-y-5">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">

            <span className="text-gray-400">
              Phone
            </span>

            <span>
              +91 9876543210
            </span>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">

            <span className="text-gray-400">
              Loan Status
            </span>

            <span className="text-green-400 font-bold">
              Approved
            </span>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">

            <span className="text-gray-400">
              KYC Status
            </span>

            <span className="text-cyan-400 font-bold">
              Verified
            </span>

          </div>

        </div>


        {/* BUTTONS */}

        <div className="grid grid-cols-2 gap-4 mt-10">

          <button className="bg-gradient-to-r from-cyan-500 to-purple-500 py-4 rounded-2xl font-bold hover:scale-105 transition-all">

            Edit Profile

          </button>

          <button className="border border-white/20 py-4 rounded-2xl hover:bg-white/10 transition-all">

            Logout

          </button>

        </div>

      </div>

    </section>

  );

}