"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Calendar, Users, Image, Archive, Plus } from "lucide-react";
import { getDashboardStats } from "@/lib/dashboardApi";

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({ councilCount: 0, membersCount: 0, eventsCount: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getDashboardStats();
        setStatsData({
          councilCount: stats.councils,
          membersCount: stats.members,
          eventsCount: stats.events,
        });
        setRecentActivity(stats.recentActivity || []);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };
    loadStats();
  }, []);

  const stats = [
    { name: "Council Members", count: statsData.councilCount, icon: <Users className="w-6 h-6" />, link: "/admin/council" },
    { name: "Members", count: statsData.membersCount, icon: <User className="w-6 h-6" />, link: "/admin/members" },
    { name: "Events", count: statsData.eventsCount, icon: <Calendar className="w-6 h-6" />, link: "/admin/events" },
    { name: "Gallery Items", count: 128, icon: <Image className="w-6 h-6" /> },
    { name: "Resources", count: 32, icon: <Archive className="w-6 h-6" /> },
  ];

  const quickActions = [
    { label: "Add Member", icon: <Plus className="w-4 h-4" />, onClick: () => {} },
    { label: "Add Council Member", icon: <Plus className="w-4 h-4" />, link: "/admin/council" },
    { label: "Create Event", icon: <Plus className="w-4 h-4" />, onClick: () => {} },
    { label: "Add Publication", icon: <Plus className="w-4 h-4" />, onClick: () => {} },
    { label: "Upload Gallery", icon: <Plus className="w-4 h-4" />, onClick: () => {} },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#002366] mb-6">Admin Dashboard</h1>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) =>
          stat.link ? (
            <Link key={stat.name} href={stat.link}>{Box(stat)}</Link>
          ) : (
            <div key={stat.name}>{Box(stat)}</div>
          )
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#002366] mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {quickActions.map((action) =>
            action.link ? (
              <Link
                key={action.label}
                href={action.link}
                className="btn flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#002366] to-[#0047b3] text-white shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
              >
                {action.icon} {action.label}
              </Link>
            ) : (
              <button
                key={action.label}
                onClick={action.onClick}
                className="btn flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#002366] to-[#0047b3] text-white shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
              >
                {action.icon} {action.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-[#002366] mb-3">Recent Activity</h2>
        <table className="w-full bg-white shadow-md rounded-xl overflow-hidden text-left border border-gray-200">
          <thead className="bg-[#002366]/10">
            <tr>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.length > 0 ? (
              recentActivity.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-none hover:bg-[#9e9210]/20 transition-colors"
                >
                  <td className="px-4 py-2 font-medium">{item.type}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 text-gray-500">{item.date?.split("T")[0]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-gray-500 text-center">
                  No recent activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-right mt-2">
          <Link
            href="/admin/recentactivity"
            className="text-[#002366] font-medium hover:text-[#0047b3] hover:underline transition-colors"
          >
            See more →
          </Link>
        </div>
      </div>
    </div>
  );

  function Box(stat) {
    return (
      <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition cursor-pointer hover:scale-[1.02] duration-200">
        <div>
          <p className="text-2xl font-bold text-[#002366]">{stat.count}</p>
          <p className="text-gray-600 mt-1">{stat.name}</p>
        </div>
        <div className="text-[#9e9210]">{stat.icon}</div>
      </div>
    );
  }
}
