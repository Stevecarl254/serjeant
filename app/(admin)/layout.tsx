"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Users,
  Calendar,
  Bell,
  Image,
  FileText,
  BookOpen,
  Mail,
  BarChart2,
  Settings,
  Home
} from "lucide-react";

const adminLinks = [
  { name: "Overview", href: "/admin", icon: Home },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Announcements", href: "/admin/announcements", icon: Bell },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Publications", href: "/admin/publications", icon: FileText },
  { name: "Resources", href: "/admin/resources", icon: BookOpen },
  { name: "Communications", href: "/admin/communications", icon: Mail },
  { name: "Reports", href: "/admin/reports", icon: BarChart2 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-[#002366] text-white flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#9e9210]/40">
          <span className={`font-bold text-lg ${sidebarOpen ? "block" : "hidden"}`}>Admin</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-[#9e9210]/30"
          >
            ☰
          </button>
        </div>

        <nav className="mt-6 flex flex-col">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#9e9210]/20 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className={`${sidebarOpen ? "block" : "hidden"}`}>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#002366]">Dashboard</h1>
          {/* Placeholder for user avatar or top actions */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#9e9210] rounded-full"></div>
          </div>
        </header>

        {/* Content area */}
        <div className="bg-white shadow rounded-xl p-6 min-h-[70vh]">
          {children}
        </div>
      </main>
    </div>
  );
}