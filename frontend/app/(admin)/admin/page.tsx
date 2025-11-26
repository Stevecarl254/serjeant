"use client";

import React from "react";
import { User, Calendar, FileText, Image, Archive, Megaphone, Plus } from "lucide-react";

export default function AdminDashboard() {
  // Sample data — replace with API calls
  const stats = [
    { name: "Members", count: 124, icon: <User className="w-6 h-6" /> },
    { name: "Events", count: 37, icon: <Calendar className="w-6 h-6" /> },
    { name: "Gallery Items", count: 128, icon: <Image className="w-6 h-6" /> },
    { name: "Resources", count: 32, icon: <Archive className="w-6 h-6" /> },
  ];

  const recentActivity = [
    { type: "Member", name: "John Doe", date: "2025-11-18" },
    { type: "Event", name: "Annual Meeting", date: "2025-11-17" },
    { type: "Publication", name: "Rules Document", date: "2025-11-16" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#002366] mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex items-center justify-between bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition"
          >
            <div>
              <p className="text-2xl font-bold text-[#002366]">{stat.count}</p>
              <p className="text-gray-600 mt-1">{stat.name}</p>
            </div>
            <div className="text-[#9e9210]">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#002366] mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 bg-[#002366] text-white px-4 py-2 rounded-lg hover:bg-[#9e9210] transition">
            <Plus className="w-4 h-4" /> Add Member
          </button>
          <button className="flex items-center gap-2 bg-[#002366] text-white px-4 py-2 rounded-lg hover:bg-[#9e9210] transition">
            <Plus className="w-4 h-4" /> Create Event
          </button>
          <button className="flex items-center gap-2 bg-[#002366] text-white px-4 py-2 rounded-lg hover:bg-[#9e9210] transition">
            <Plus className="w-4 h-4" /> Add Publication
          </button>
          <button className="flex items-center gap-2 bg-[#002366] text-white px-4 py-2 rounded-lg hover:bg-[#9e9210] transition">
            <Plus className="w-4 h-4" /> Upload Gallery
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-[#002366] mb-3">Recent Activity</h2>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#002366]/10">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, idx) => (
                <tr key={idx} className="border-b last:border-none hover:bg-[#9e9210]/10 transition">
                  <td className="px-4 py-2 font-medium">{item.type}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}