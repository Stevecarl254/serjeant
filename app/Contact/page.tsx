"use client";

import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Integrate your backend here)");
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="w-full h-[350px] md:h-[450px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: "url('about-hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-gradient-to-r from-[#002366]/80 to-[#9e9210]/70 w-full h-full flex flex-col justify-center items-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold">Contact Us</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">
            Reach out to the{" "}
            <span className="text-[#9e9210] font-semibold">
              Serjeant At Arms Society
            </span>{" "}
            team for inquiries, membership info, or general support.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="w-full bg-[#f9f9f9] py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#002366] mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject *"
                value={formData.subject}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <textarea
                name="message"
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210] h-32 resize-none"
              />

              <button
                type="submit"
                className="mt-2 bg-[#002366] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-[#001847] transition"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold text-[#002366] mb-2">
                Our Offices
              </h3>
              <p>Parliament of Kenya, Nairobi</p>
              <p>PO Box 12345, Nairobi, Kenya</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#002366] mb-2">Email</h3>
              <p>info@serjeantatarms.or.ke</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#002366] mb-2">Phone</h3>
              <p>+254 700 000 000</p>
            </div>

            {/* ⭐ Added Office Hours Section */}
            <div>
              <h3 className="text-xl font-bold text-[#002366] mb-2">
                Office Hours
              </h3>
              <p>Monday – Friday: 8:00 AM – 5:00 PM</p>
              <p>Saturday: 9:00 AM – 1:00 PM</p>
              <p className="text-gray-600 italic">Closed on Sundays & Public Holidays</p>
            </div>

            {/* Map Section */}
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Parliament of Kenya Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.951509374834!2d36.81724421528512!3d-1.2920658991430216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1736c9b40a7d%3A0x919a4f5cbbf9379a!2sParliament%20of%20Kenya!5e0!3m2!1sen!2ske!4v1705208465368!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;