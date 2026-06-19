export default function Testimonials() {

  const testimonials = [

    {
      name: "Anjana Sharma",
      role: "Business Owner",
      review:
        "LoanPay helped me grow my business with quick loan approval and amazing support.",
    },

    {
      name: "Rahul Verma",
      role: "Software Engineer",
      review:
        "Very fast and secure loan process. The EMI plans are very affordable.",
    },

    {
      name: "Inaya Khan",
      role: "Freelancer",
      review:
        "Professional fintech service with excellent customer support experience.",
    },

  ];

  return (

    <section className="py-24 bg-[#020617] text-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            What Our Customers Say
          </h2>

          <p className="text-gray-400 mt-4 text-xl">
            Trusted by thousands of happy users
          </p>

        </div>


        {/* TESTIMONIAL CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {
            testimonials.map((item, index) => (

              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-xl hover:scale-105 transition-all duration-300"
              >

                {/* PROFILE */}

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-2xl font-bold">

                    {item.name.charAt(0)}

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">
                      {item.name}
                    </h3>

                    <p className="text-gray-400">
                      {item.role}
                    </p>

                  </div>

                </div>


                {/* REVIEW */}

                <p className="text-gray-300 leading-8 text-lg">

                  “{item.review}”

                </p>


                {/* STARS */}

                <div className="flex gap-2 mt-8 text-yellow-400 text-2xl">

                  ⭐ ⭐ ⭐ ⭐ ⭐

                </div>

              </div>

            ))
          }

        </div>

      </div>

    </section>

  );

}