export default function Services() {

  const services = [

    {
      emoji: "💳",
      title: "Personal Loan",
      description:
        "Instant personal loans with low interest rates.",
    },

    {
      emoji: "🏠",
      title: "Home Loan",
      description:
        "Affordable home loans with flexible EMI options.",
    },

    {
      emoji: "💼",
      title: "Business Loan",
      description:
        "Grow your business with quick loan approval.",
    },

    {
      emoji: "🎓",
      title: "Education Loan",
      description:
        "Finance your education with secure student loans.",
    },

    {
      emoji: "🚗",
      title: "Car Loan",
      description:
        "Get your dream car with easy financing options.",
    },

    {
      emoji: "🛡️",
      title: "Insurance",
      description:
        "Protect your future with trusted insurance plans.",
    },

  ];


  return (

    <section className="py-24 bg-[#020617] text-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">

            Our Services

          </h2>

          <p className="text-gray-400 mt-4 text-xl">

            Explore our modern fintech loan services

          </p>

        </div>


        {/* CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {

            services.map((service, index) => (

              <div

                key={index}

                className="bg-white/5 border border-white/10 rounded-[35px] p-8 hover:scale-105 hover:border-cyan-400 transition-all duration-300 backdrop-blur-xl"

              >

                {/* EMOJI ICON */}

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(0,255,255,0.3)]">

                  {service.emoji}

                </div>


                {/* TITLE */}

                <h3 className="text-3xl font-bold mb-4">

                  {service.title}

                </h3>


                {/* DESCRIPTION */}

                <p className="text-gray-400 leading-8">

                  {service.description}

                </p>


                {/* BUTTON */}

                <button className="mt-8 bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all">

                  Learn More

                </button>

              </div>

            ))

          }

        </div>

      </div>

    </section>

  );

}