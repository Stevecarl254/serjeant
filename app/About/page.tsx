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

      {/* Objectives Section */}
      <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

          {/* Objectives Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#002366] relative inline-block mb-8">
              Our Objectives
              <FaBullseye className="absolute -top-8 -left-10 text-[#002366] opacity-10 text-[6rem]" />
            </h3>
            <ul className="list-disc list-inside space-y-4 text-lg text-gray-700">
              <li>Promote discipline and accountability among members.</li>
              <li>Encourage active community service and engagement.</li>
              <li>Develop leadership skills through training and mentorship.</li>
              <li>Foster unity and collaboration across all regions.</li>
              <li>Recognize and reward excellence in service and leadership.</li>
            </ul>
          </motion.div>

          {/* Objectives Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <img
              src="about.obj.jpg"
              alt="Objectives Image"
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
            />
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
            Our dedicated council leads the Serjeant At Arms Society with vision and integrity. Learn more about the individuals driving our mission forward.
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