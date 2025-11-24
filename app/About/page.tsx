"use client";

import React from "react";
import Link from "next/link";
import { FaBullseye } from "react-icons/fa";
import { motion } from "framer-motion";

const AboutPage: React.FC = () => {
  return (
    <div className="w-full">

      {/* Hero Section */}
      <section
        className="relative w-full h-[90vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('about-hero.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 px-6 md:px-0 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Promoting discipline, service, and leadership excellence since our formation.
          </p>
          <Link href="/membership">
            <button className="bg-[#9e9210] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition">
              Join the Society
            </button>
          </Link>
        </div>
      </section>

      {/* Who We Are */}
      <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] relative inline-block">
              Who We Are
              <span className="block w-16 h-1 bg-[#9e9210] mt-2 rounded-full"></span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              The Serjeant At Arms Society was founded in [Year] to unite individuals committed to discipline, leadership, and service. We foster integrity and accountability among members while positively impacting communities nationwide.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="about-who.jpeg"
              alt="Serjeant At Arms"
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="w-full bg-gray-50 text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          <motion.div
            className="space-y-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#002366]">
              Our Vision
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              To be the premier society fostering leadership, unity, and civic responsibility nationwide.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#002366]">
              Our Mission
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              To develop disciplined, service-oriented leaders through mentorship, training, and community engagement.
            </p>
          </motion.div>

        </div>
      </section>

      {/* History Section */}
      <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] relative inline-block">
              Our History
              <span className="block w-16 h-1 bg-[#9e9210] mt-2 rounded-full"></span>
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              The office of the Serjeant-At-Arms is one of the oldest parliamentary institutions in the world,
              with its origins traced to the British Parliament in the 12th century. The title “Serjeant” comes
              from the medieval word “serviens”, meaning servant of the Crown. These officers served the King
              directly and were entrusted with matters of security, enforcement, and ceremonial responsibilities.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              By the 14th century, the Serjeant-At-Arms had become an established officer of the House of Commons
              and House of Lords in the United Kingdom. Their duties evolved from being the King’s enforcers to
              the Parliament’s guardians.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              As the Westminster parliamentary system spread around the world, including Kenya, Uganda, India,
              Canada, Australia, and many Commonwealth countries.The office of the Serjeant-At-Arms became a key
              pillar in legislative assemblies.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              In Kenya, the office was inherited from the British parliamentary tradition during the colonial period.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="about-history.jpg"
              alt="History Image"
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
            />
          </motion.div>

        </div>
      </section>

      {/* Mandate Section */}
      <section className="w-full bg-gray-50 text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">

          <motion.div
            className="space-y-6 bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] inline-block">
              Our Mandate
              <span className="block w-16 h-1 bg-[#9e9210] mt-2 rounded-full"></span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              The Serjeant At Arms Society is mandated to uphold discipline, maintain order during official
              functions, protect the dignity of the institution, and support leadership structures across all
              levels. Members are expected to lead by example in conduct, service, and civic engagement.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Code of Conduct Section */}
      <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] inline-block">
              Code of Conduct
              <span className="block w-16 h-1 bg-[#9e9210] mt-2 rounded-full"></span>
            </h2>

            <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
              <li>Maintain discipline and uphold the values of the society at all times.</li>
              <li>Respect leadership structures and follow established protocols.</li>
              <li>Conduct oneself with integrity, humility, and professionalism.</li>
              <li>Promote unity, teamwork, and respect among all members.</li>
              <li>Serve communities with commitment, fairness, and transparency.</li>
            </ul>
          </motion.div>

        </div>
      </section>

      {/* Meet Council CTA */}
      <section className="w-full bg-gray-100 text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366]">
            Meet Our Council Members
          </h2>
          <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
            Our dedicated council leads the Serjeant At Arms Society with vision and integrity.
            Learn more about the individuals driving our mission forward.
          </p>
          <Link href="/council">
            <button className="bg-[#9e9210] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition">
              View Council Members
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;