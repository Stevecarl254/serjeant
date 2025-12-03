"use client";

import { useState } from "react";
import { FaUsers, FaEnvelope, FaUserShield, FaCrown } from "react-icons/fa";

type Member = {
  id: number;
  fullName: string;
  plan: string;
  joined_at: string;
};

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

const ReportPage = () => {
  const [members] = useState<Member[]>([
    { id: 1, fullName: "Major Samson Sorobit", plan: "premium", joined_at: "2025-01-10" },
    { id: 2, fullName: "Mr. Gabriel Awiti Boyi", plan: "standard", joined_at: "2025-02-05" },
    { id: 3, fullName: "Ms. Faith Kamori", plan: "standard", joined_at: "2025-03-12" },
    { id: 4, fullName: "Amos Cherogony", plan: "premium", joined_at: "2025-04-01" },
    { id: 5, fullName: "George Macharia", plan: "standard", joined_at: "2025-05-20" },
    { id: 6, fullName: "James Sirite", plan: "standard", joined_at: "2025-06-15" },
  ]);

  const [messages] = useState<Message[]>([
    { id: 1, name: "John Doe", email: "john@example.com", message: "Interested in membership", read: false, created_at: "2025-11-01" },
    { id: 2, name: "Jane Doe", email: "jane@example.com", message: "How do I join?", read: true, created_at: "2025-11-03" },
    { id: 3, name: "Mark Smith", email: "mark@example.com", message: "Need more info", read: false, created_at: "2025-11-05" },
  ]);

  const totalMembers = members.length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.read).length;
  const standardMembers = members.filter(m => m.plan === "standard").length;
  const premiumMembers = members.filter(m => m.plan === "premium").length;

  return (
    <section className="w-full p-4 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002366] mb-6 md:mb-10 text-center md:text-left">Admin Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-10">
        {[
          { title: "Total Members", value: totalMembers, icon: <FaUsers className="text-[#002366] text-2xl md:text-3xl" /> },
          { title: "Total Messages", value: totalMessages, icon: <FaEnvelope className="text-[#9e9210] text-2xl md:text-3xl" /> },
          { title: "Unread Messages", value: unreadMessages, icon: <FaEnvelope className="text-red-600 text-2xl md:text-3xl" /> },
          { title: "Standard Members", value: standardMembers, icon: <FaUserShield className="text-[#002366] text-2xl md:text-3xl" /> },
          { title: "Premium Members", value: premiumMembers, icon: <FaCrown className="text-[#9e9210] text-2xl md:text-3xl" /> },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl shadow flex flex-col md:flex-col sm:flex-row items-center sm:items-start gap-2">
            <div className="flex-shrink-0 mr-0 sm:mr-4">{card.icon}</div>
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-xs md:text-sm">{card.title}</p>
              <p className="text-xl md:text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Members Table */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10 overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-[#002366]">Recent Members</h2>
        <div className="min-w-[600px] md:min-w-full">
          <table className="w-full text-left border-collapse text-sm md:text-base">
            <thead>
              <tr>
                <th className="border-b p-2 md:p-3 text-gray-600">#</th>
                <th className="border-b p-2 md:p-3 text-gray-600">Full Name</th>
                <th className="border-b p-2 md:p-3 text-gray-600">Plan</th>
                <th className="border-b p-2 md:p-3 text-gray-600">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-100">
                  <td className="border-b p-2 md:p-3">{i + 1}</td>
                  <td className="border-b p-2 md:p-3">{m.fullName}</td>
                  <td className="border-b p-2 md:p-3 capitalize">{m.plan}</td>
                  <td className="border-b p-2 md:p-3">{m.joined_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Messages Table */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10 overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-[#002366]">Recent Messages</h2>
        <div className="min-w-[700px] md:min-w-full">
          <table className="w-full text-left border-collapse text-sm md:text-base">
            <thead>
              <tr>
                <th className="border-b p-2 md:p-3 text-gray-600">#</th>
                <th className="border-b p-2 md:p-3 text-gray-600">Name</th>
                <th className="border-b p-2 md:p-3 text-gray-600">Email</th>
                <th className="border-b p-2 md:p-3 text-gray-600">Message</th>
                <th className="border-b p-2 md:p-3 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, i) => (
                <tr key={msg.id} className="hover:bg-gray-100">
                  <td className="border-b p-2 md:p-3">{i + 1}</td>
                  <td className="border-b p-2 md:p-3">{msg.name}</td>
                  <td className="border-b p-2 md:p-3">{msg.email}</td>
                  <td className="border-b p-2 md:p-3">{msg.message}</td>
                  <td className={`border-b p-2 md:p-3 ${msg.read ? "text-green-600" : "text-red-600"}`}>
                    {msg.read ? "Read" : "Unread"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Membership Plan Breakdown */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-[#002366]">Membership Plan Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#f9f9f9] p-3 md:p-4 rounded-lg flex justify-between">
            <p className="font-medium">Standard Members</p>
            <p className="font-bold">{standardMembers}</p>
          </div>
          <div className="bg-[#f9f9f9] p-3 md:p-4 rounded-lg flex justify-between">
            <p className="font-medium">Premium Members</p>
            <p className="font-bold">{premiumMembers}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportPage;