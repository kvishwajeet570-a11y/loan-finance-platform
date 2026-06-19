export default function Footer() {

  return (

    <footer className="bg-[#020617] border-t border-white/10 text-white py-16">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO */}

        <div>

          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            LoanPay
          </h2>

          <p className="text-gray-400 mt-5 leading-8">
            India's trusted fintech platform for
            fast and secure loans.
          </p>

        </div>


        {/* COMPANY */}

        <div>

          <h3 className="text-2xl font-bold mb-6">
            Company
          </h3>

          <ul className="space-y-4 text-gray-400">

            <li>
              About Us
            </li>

            <li>
              Careers
            </li>

            <li>
              Blog
            </li>

            <li>
              Contact
            </li>

          </ul>

        </div>


        {/* SERVICES */}

        <div>

          <h3 className="text-2xl font-bold mb-6">
            Services
          </h3>

          <ul className="space-y-4 text-gray-400">

            <li>
              Personal Loan
            </li>

            <li>
              Home Loan
            </li>

            <li>
              Car Loan
            </li>

            <li>
              Business Loan
            </li>

          </ul>

        </div>


        {/* LEGAL */}

        <div>

          <h3 className="text-2xl font-bold mb-6">
            Legal
          </h3>

          <ul className="space-y-4 text-gray-400">

            <li>
              Privacy Policy
            </li>

            <li>
              Terms & Conditions
            </li>

            <li>
              Disclaimer
            </li>

            <li>
              Cookies
            </li>

          </ul>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">

        © 2026 LoanPay. All rights reserved.

      </div>

    </footer>

  );

}