"use client";

import { FaUserTie } from "react-icons/fa";

const councilMembers = [
  {
    role: "Patron",
    name: "Major Samson Sorobit",
    description: "Director Chief Serjeant-at-arms Senate",
    color: "bg-[#002366]",
  },
  {
    role: "Chairperson",
    name: "Mr. Gabriel Awiti Boyi",
    description: "Chief Serjeant-at-arms Homa Bay",
    color: "bg-[#9e9210]",
  },
  {
    role: "Secretary",
    name: "Ms. Faith Kamori",
    description: "Serjeant-at-arms Nyandarua",
    color: "bg-[#7e7411]",
  },
  {
    role: "Treasurer",
    name: "Amos Cherogony",
    description: "Director Chief Serjeant at arms Baringo",
    color: "bg-[#002366]",
  },
  {
    role: "Member",
    name: "George Macharia",
    description: "Director Chief Serjeant at arms Kiambu",
    color: "bg-[#9e9210]",
  },
  {
    role: "Member",
    name: "James Sirite",
    description: "Chief Serjeant at arms Turkana",
    color: "bg-[#7e7411]",
  },
];

const secretariat = [
  { name: "Stephen Maru", role: "Secretariat" },
  { name: "Daniel Kirwa", role: "Secretariat" },
  { name: "Abdi Salat", role: "Secretariat" },
  { name: "Dorothy Achieng", role: "Secretariat" },
];

const CouncilPage = () => {
  return (
    <section className="w-full bg-gray-50 min-h-screen py-16 px-4 md:px-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#002366] tracking-wide relative inline-block">
          Council Members
          <span className="block w-24 h-1 bg-[#9e9210] mx-auto mt-2 rounded-full"></span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Meet our <span className="text-[#9e9210] font-semibold">Interim Council Members</span> 
          and Secretariat, leading the Serjeant At Arms Society with discipline, service, and leadership excellence.
        </p>
      </div>

      {/* Interim Council Members */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-[#002366] mb-6 border-b border-gray-300 pb-2">
          Interim Council Members
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {councilMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-transform transform hover:-translate-y-2"
            >
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 text-white text-sm font-semibold rounded-full ${member.color}`}
                >
                  {member.role}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#002366] mb-1">{member.name}</h3>
              <p className="text-gray-700">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Secretariat */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-[#002366] mb-6 border-b border-gray-300 pb-2">
          Secretariat
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {secretariat.map((person, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center justify-center text-center hover:shadow-2xl transition-transform transform hover:-translate-y-1 border-l-4 border-[#9e9210]"
            >
              <div className="bg-[#9e9210] text-white rounded-full p-3 mb-3">
                <FaUserTie className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{person.name}</h3>
              <p className="text-gray-600 text-sm">{person.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <p className="text-gray-700 text-lg">
          Interested in joining or learning more about the council?{" "}
          <a
            href="/contact"
            className="text-[#9e9210] font-semibold underline hover:text-[#7e7411]"
          >
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
};

export default CouncilPage;