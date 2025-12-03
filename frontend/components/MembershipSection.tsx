"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaCrown, FaUserShield } from "react-icons/fa";

const MembershipSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "premium" | null>(null);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Membership Request:", { plan: selectedPlan, ...formData });
    setSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // stop confetti after 3s
  };

  // 🔹 Show FORM MODAL when a plan is selected
  if (selectedPlan) {
    return (
      <section className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 overflow-hidden">
        <div
          className={`max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-h-[95vh] overflow-y-auto transform transition-all duration-500 ${
            submitted ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{ animation: "slideDown 0.4s ease-out" }}
        >
          {!submitted ? (
            <>
              <button
                onClick={() => setSelectedPlan(null)}
                className="mb-4 text-[#002366] underline hover:text-[#001847]"
              >
                ← Back
              </button>

              <h2 className="text-2xl font-bold text-[#002366] mb-6 text-center">
                Join {selectedPlan === "standard" ? "Standard" : "Premium"} Membership
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#002366] text-white py-3 rounded-lg shadow-md hover:bg-[#001847] transition font-semibold transform hover:scale-105"
                >
                  {selectedPlan === "standard" ? "Join Standard" : "Join Premium"}
                </button>
              </form>
            </>
          ) : (
            <div
              className="text-center py-8 animate-fadeIn relative"
              style={{ animationDuration: "0.5s" }}
            >
              {showConfetti && <Confetti />}
              <FaCheckCircle className="text-[#9e9210] mx-auto text-6xl mb-4" />
              <h3 className="text-2xl font-bold text-[#002366] mb-2">Thank you!</h3>
              <p className="text-gray-700 mb-6">
                Your {selectedPlan === "standard" ? "Standard" : "Premium"} membership request has been received.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedPlan(null);
                  setFormData({ fullName: "", email: "", phone: "" });
                }}
                className="bg-[#002366] text-white py-2 px-6 rounded-lg shadow-md hover:bg-[#001847] transition font-semibold"
              >
                Back to Membership Options
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes slideDown {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </section>
    );
  }

  // 🔹 Show MEMBERSHIP CARDS normally
  return (
    <section className="w-full bg-[#f9f9f9] text-gray-900 py-16 px-4 md:px-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] tracking-wide relative inline-block">
          Membership Packages
          <span className="block w-20 h-1 bg-[#9e9210] mx-auto mt-2 rounded-full"></span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join the <span className="text-[#9e9210] font-semibold">Serjeant At Arms Society</span> and be part of a nationwide network of discipline, service, and leadership excellence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Standard Membership */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 relative overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute -top-6 -left-6 text-[#002366] opacity-10 text-7xl">
            <FaUserShield />
          </div>
          <h3 className="text-2xl font-bold text-[#002366] mb-2 flex items-center gap-2">
            <FaUserShield className="text-[#9e9210]" /> Standard Membership
          </h3>
          <p className="text-[#9e9210] font-bold text-xl mb-4">KES 1,000 / Year</p>
          <ul className="space-y-2 text-gray-700 flex-1">
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Access to National Events</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Membership Identification Badge</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> General Voting Rights</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Monthly Newsletter & Reports</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Priority Access at National Events</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Exclusive Leadership Forums</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> VIP Recognition & Premium Badge</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Invitation to Annual National Gala</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Discounts on Society Merchandise</li>
          </ul>
          <button
            onClick={() => setSelectedPlan("standard")}
            className="w-full bg-[#002366] text-white py-3 rounded-lg shadow-md hover:bg-[#001847] transition font-semibold transform hover:scale-105 mt-4"
          >
            Join Standard
          </button>
        </div>

        {/* Premium Membership */}
        <div className="bg-white border-2 border-[#9e9210] rounded-2xl shadow-xl p-8 relative overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <span className="absolute top-4 right-4 bg-[#9e9210] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
          <div className="absolute -top-6 -left-6 text-[#9e9210] opacity-10 text-7xl"><FaCrown /></div>
          <h3 className="text-2xl font-bold text-[#002366] mb-2 flex items-center gap-2">
            <FaCrown className="text-[#9e9210]" /> Premium Membership
          </h3>
          <p className="text-[#9e9210] font-bold text-xl mb-4">KES 5,000 / Year</p>
          <ul className="space-y-2 text-gray-700 flex-1">
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> All Standard Benefits</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Priority Access at National Events</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Exclusive Leadership Forums</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> VIP Recognition & Premium Badge</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Invitation to Annual National Gala</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Discounts on Society Merchandise</li>
          </ul>
          <button
            onClick={() => setSelectedPlan("premium")}
            className="w-full bg-[#9e9210] text-white py-3 rounded-lg shadow-md hover:bg-[#7e7411] transition font-semibold transform hover:scale-105 mt-4"
          >
            Join Premium
          </button>
        </div>
      </div>
    </section>
  );
};

// 🔹 Confetti Component
const Confetti = () => {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    setPieces(Array.from({ length: 50 }, (_, i) => i));
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p}
          className="absolute w-2 h-2 bg-[#9e9210] rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1.5}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default MembershipSection;