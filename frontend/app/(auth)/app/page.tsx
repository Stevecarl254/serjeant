"use client";

import React, { useEffect, useState } from "react";
import { useGuard } from "@/hooks/useGuard";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Payment {
  amount: number;
  method: string;
  date: string;
  transactionId: string;
}

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  packageType?: string;
  isActive: boolean;
  paymentConfirmed: boolean;
  membershipNumber?: string;
  firstPaymentDate?: string;
  lastPaymentDate?: string;
  expiryDate?: string;
  nextRenewal?: string;
  payments?: Payment[];
}

export default function ProfilePage() {
  useGuard("profile");
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const memberId =
    typeof window !== "undefined"
      ? localStorage.getItem("memberId")
      : null;

  useEffect(() => {
    if (!memberId) return;

    const fetchMember = async () => {
      try {
        console.log("Fetching member profile...");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/members/public/${memberId}`
        );
        console.log("Profile data:", data);
        setMember(data.member);
      } catch (err) {
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const downloadCertificate = () => {
    if (!member?.isActive) return; // only active members can download
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/members/public/${member._id}/certificate`;
  };

  const renewMembership = () => {
    router.push("/renew"); // use your actual renew page route
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile…
      </div>
    );
  }

  if (!memberId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        You have no account. Please register.
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Fetching your profile…
      </div>
    );
  }

  // NEW: Computed states
  const isExpired =
    member.expiryDate && new Date(member.expiryDate) < new Date();

  const canDownload = member.isActive && member.paymentConfirmed;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Toaster position="top-center" />

      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg shadow-lg"
      >
        &larr; Back
      </button>

      <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg rounded-2xl p-10 mt-16">
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 border-b border-gray-200 pb-8">
          <img
            src={"/profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-green-600 object-cover"
          />

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900">
              {member.fullName}
            </h1>

            {/* STATUS BADGE — UPDATED */}
            <p
              className={`mt-1 font-semibold ${
                isExpired
                  ? "text-red-600"
                  : member.isActive
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {isExpired
                ? "Expired"
                : member.isActive
                ? "Active Member"
                : "Pending Payment"}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Member ID: {member.membershipNumber || "—"}
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 text-gray-700">
          {/* PERSONAL INFO */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {member.fullName}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Phone:</strong> {member.phone}</p>
              <p><strong>DOB:</strong> {member.dob || "—"}</p>
            </div>
          </div>

          {/* MEMBERSHIP DETAILS */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Membership Details</h2>
            <div className="space-y-2">
              <p><strong>Type:</strong> {member.packageType || "—"}</p>
              <p><strong>Status:</strong> {member.isActive ? "Active" : "Inactive"}</p>
              <p><strong>Started:</strong> {member.firstPaymentDate || "—"}</p>
              <p><strong>Expires:</strong> {member.expiryDate || "—"}</p>
              <p><strong>Next Renewal:</strong> {member.nextRenewal || "—"}</p>
            </div>
          </div>

          {/* PAYMENT HISTORY */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">
              Activity & Payment History
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Last Payment: {member.lastPaymentDate || "—"}
              </li>

              {member.payments?.length ? (
                member.payments.map((p, idx) => (
                  <li key={idx}>
                    {p.amount} via {p.method} on{" "}
                    {new Date(p.date).toLocaleDateString()} —{" "}
                    <span className="text-gray-500">
                      Transaction: {p.transactionId}
                    </span>
                  </li>
                ))
              ) : (
                <li>No payments recorded</li>
              )}
            </ul>
          </div>

          {/* CERTIFICATE SECTION */}
          {canDownload && (
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">
                Membership Certificate
              </h2>
              <p className="text-gray-700 mb-4">
                Download your membership certificate below.
              </p>

              <button
                onClick={downloadCertificate}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Download Certificate
              </button>
            </div>
          )}

          {/* RENEW CTA IF EXPIRED */}
          {isExpired && (
            <div className="md:col-span-2 bg-red-100 p-4 rounded-xl border border-red-300">
              <h2 className="text-xl font-semibold mb-2 text-red-800">
                Membership Expired
              </h2>
              <p className="text-red-700 mb-3">
                Your membership has expired. Renew now to reactivate your
                benefits and unlock certificate access.
              </p>

              <button
                onClick={renewMembership}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Renew Now
              </button>
            </div>
          )}

          {/* UNPAID MESSAGE */}
          {!member.isActive && !isExpired && (
            <div className="md:col-span-2 bg-yellow-100 p-4 rounded-xl border border-yellow-300">
              <h2 className="text-xl font-semibold mb-2 text-yellow-800">
                Complete Your Membership
              </h2>
              <p className="text-yellow-700">
                Your profile is created, but your membership isn’t active yet.
                Activate your membership with payment to unlock all features.
              </p>
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-start">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Edit Profile
          </button>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
