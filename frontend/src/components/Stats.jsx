export default function Stats() {

  const stats = [

    {
      number: "250K+",
      label: "Happy Customers",
      color: "text-cyan-400",
    },

    {
      number: "₹500Cr+",
      label: "Loans Approved",
      color: "text-purple-400",
    },

    {
      number: "98%",
      label: "Success Rate",
      color: "text-green-400",
    },

    {
      number: "24/7",
      label: "Customer Support",
      color: "text-pink-400",
    },

  ];

  return (

    <section className="py-24 bg-[#081120] text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {
            stats.map((item, index) => (

              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[35px] p-10 text-center backdrop-blur-xl hover:scale-105 transition-all duration-300"
              >

                <h2 className={`text-5xl font-extrabold ${item.color}`}>

                  {item.number}

                </h2>

                <p className="text-gray-400 mt-4 text-lg">

                  {item.label}

                </p>

              </div>

            ))
          }

        </div>

      </div>

    </section>

  );

}