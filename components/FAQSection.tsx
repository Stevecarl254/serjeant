"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How do I become a member?",
      answer: "Select a membership package and complete the registration form on our website. You’ll receive confirmation instantly."
    },
    {
      question: "What are the benefits of Standard vs Premium membership?",
      answer: "Standard members access events, newsletters, and voting rights. Premium members enjoy all these plus VIP access, leadership forums, and exclusive gala invitations."
    },
    {
      question: "How can I attend events?",
      answer: "Once registered, you can book events through our site. Digital passes or tickets will be issued depending on the event type."
    },
    {
      question: "Can I upgrade my membership later?",
      answer: "Yes. Upgrade from Standard to Premium anytime by paying the difference in membership fees."
    },
    {
      question: "How do I get my membership badge?",
      answer: "Badges are sent digitally after registration. Physical badges are distributed during national events."
    },
    {
      question: "How often are newsletters sent?",
      answer: "Monthly newsletters are emailed, covering events, updates, and society news."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-gray-50 text-gray-900 py-20 px-6 md:px-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#002366] tracking-wide relative inline-block">
          Frequently Asked Questions
          <span className="block w-20 h-1 bg-[#9e9210] mx-auto mt-2 rounded-full"></span>
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto leading-relaxed text-base md:text-sm">
          Find answers to common questions about the <span className="text-[#9e9210] font-semibold">Serjeant At Arms Society</span> and our membership programs.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-3">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left focus:outline-none"
            >
              <span className="text-base md:text-lg font-medium text-gray-800">{faq.question}</span>
              {openIndex === index ? (
                <FaChevronUp className="text-[#9e9210] text-base md:text-lg" />
              ) : (
                <FaChevronDown className="text-[#9e9210] text-base md:text-lg" />
              )}
            </button>
            <div
              className={`mt-1 text-gray-700 text-sm md:text-base transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;