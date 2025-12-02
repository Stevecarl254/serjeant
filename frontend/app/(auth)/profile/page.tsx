"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  phone: string;
  dob: string;
  membershipType: string;
  status: string;
  joined: string;
  nextRenewal: string;
  lastPayment: string;
  meetingsAttended: number;
  receiptsDownloaded: number;
  hasPaid: boolean;
}

export default function MemberProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
        }
      } else {
        // Dummy user for testing
        setUser({
          name: "Stephen Maisiba",
          email: "steve@gmail.com",
          phone: "+254 712 345 678",
          dob: "12 Jan 1998",
          membershipType: "Annual",
          status: "Paid",
          joined: "05 March 2024",
          nextRenewal: "05 March 2025",
          lastPayment: "KES 3,000 – Feb 2025",
          meetingsAttended: 3,
          receiptsDownloaded: 4,
          hasPaid: true
        });
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  const downloadCertificate = () => {
    const certificateText = `Membership Certificate\n\nName: ${user.name}\nMembership Type: ${user.membershipType}\nStatus: ${user.status}\nJoined: ${user.joined}`;
    const blob = new Blob([certificateText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${user.name}-membership-certificate.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* STICKY BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg shadow-lg"
      >
        &larr; Back
      </button>

      {/* FULL-WIDTH WHITE CARD */}
      <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg rounded-2xl p-10 mt-16">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 border-b border-gray-200 pb-8">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-green-600"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-green-600 font-semibold mt-1">Active Member</p>
            <p className="text-gray-500 text-sm mt-1">Member ID: SAA-2025-0013</p>
          </div>
        </div>

        {/* SECTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 text-gray-700">
          {/* PERSONAL INFO */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>DOB:</strong> {user.dob}</p>
            </div>
          </div>

          {/* MEMBERSHIP DETAILS */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Membership Details</h2>
            <div className="space-y-2">
              <p><strong>Type:</strong> {user.membershipType}</p>
              <p><strong>Status:</strong> {user.status}</p>
              <p><strong>Joined:</strong> {user.joined}</p>
              <p><strong>Next Renewal:</strong> {user.nextRenewal}</p>
            </div>
          </div>

          {/* ACTIVITY & HISTORY */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity & History</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Last Payment: {user.lastPayment}</li>
              <li>{user.meetingsAttended} Meetings Attended This Month</li>
              <li>Has Downloaded {user.receiptsDownloaded} Receipts</li>
            </ul>
          </div>

          {/* MEMBERSHIP CERTIFICATE */}
          {user.hasPaid && (
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Membership Certificate</h2>
              <p className="text-gray-700 mb-4">
                You can download your official membership certificate below.
              </p>
              <button
                onClick={downloadCertificate}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Download Certificate
              </button>
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-start">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">Edit Profile</button>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition">Change Password</button>
        </div>
      </div>
    </div>
  );
}