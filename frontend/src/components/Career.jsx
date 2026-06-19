export default function Career() {

  const jobs = [

    {
      title: "Frontend Developer",
      type: "Full Time",
      salary: "₹45,000/month",
    },

    {
      title: "Backend Developer",
      type: "Remote",
      salary: "₹60,000/month",
    },

    {
      title: "Loan Advisor",
      type: "Part Time",
      salary: "₹30,000/month",
    },

  ];

  return (

    <section className="py-24 bg-[#081120] text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Careers
          </h2>

          <p className="text-gray-400 mt-4 text-xl">
            Join our fast growing fintech company
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {
            jobs.map((job, index) => (

              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all"
              >

                <h3 className="text-2xl font-bold mb-4">
                  {job.title}
                </h3>

                <p className="text-cyan-400 mb-2">
                  {job.type}
                </p>

                <p className="text-green-400 mb-6">
                  {job.salary}
                </p>

                <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 py-4 rounded-2xl font-bold">
                  Apply Now
                </button>

              </div>

            ))
          }

        </div>

      </div>

    </section>

  );

}