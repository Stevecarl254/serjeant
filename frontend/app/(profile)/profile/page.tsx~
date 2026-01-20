"use client";

import React, { useEffect, useState } from "react";
import { useGuard } from "@/hooks/useGuard";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

// ========== HELPERS ==========
const formatDate = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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

// ========== COMPONENT ==========
export default function ProfilePage() {
  useGuard("profile");
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const memberId =
    typeof window !== "undefined" ? localStorage.getItem("memberId") : null;

  useEffect(() => {
    if (!memberId) return;

    const fetchMember = async () => {
      try {
        console.log("Fetching member profile...");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/members/public/${memberId}`
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
    if (!member?.isActive || !member?.paymentConfirmed) return;
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/members/public/${member._id}/certificate`,
      "_blank"
    );
  };

  const goToPayment = () => {
    if (!member) return;
    router.push(
      `/payment?memberId=${member._id}&plan=${member.packageType}`
    );
  };

  const renewMembership = () => {
    router.push("/renew");
  };

  if (loading || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile…
      </div>
    );
  }

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
        {/* HEADER */}
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
            <h2 className="text-2xl font-semibold mb-4">
              Personal Information
            </h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {member.fullName}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Phone:</strong> {member.phone}</p>
              <p><strong>DOB:</strong> {member.dob || "—"}</p>
            </div>
          </div>

          {/* MEMBERSHIP DETAILS */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Membership Details
            </h2>
            <div className="space-y-2">
              <p><strong>Type:</strong> {member.packageType || "—"}</p>
              <p><strong>Status:</strong> {member.isActive ? "Active" : "Inactive"}</p>
              <p><strong>Started:</strong> {formatDate(member.firstPaymentDate)}</p>
              <p><strong>Expires:</strong> {formatDate(member.expiryDate)}</p>
              <p><strong>Next Renewal:</strong> {formatDate(member.nextRenewal)}</p>
            </div>
          </div>

          {/* PAYMENT HISTORY */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">
              Activity & Payment History
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>Last Payment: {formatDate(member.lastPaymentDate)}</li>

              {member.payments?.length ? (
                member.payments.map((p, idx) => (
                  <li key={idx}>
                    {p.amount} via {p.method} on {formatDate(p.date)} —{" "}
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

          {/* CERTIFICATE */}
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

          {/* EXPIRED */}
          {isExpired && (
            <div className="md:col-span-2 bg-red-100 p-4 rounded-xl border border-red-300">
              <h2 className="text-xl font-semibold mb-2 text-red-800">
                Membership Expired
              </h2>
              <p className="text-red-700 mb-3">
                Your membership has expired. Renew to reactivate your benefits.
              </p>

              <button
                onClick={renewMembership}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Renew Now
              </button>
            </div>
          )}

          {/* UNPAID — ADDED PAYMENT BUTTON + LINK */}
          {!member.isActive && !isExpired && (
            <div className="md:col-span-2 bg-yellow-100 p-4 rounded-xl border border-yellow-300">
              <h2 className="text-xl font-semibold mb-2 text-yellow-800">
                Complete Your Membership
              </h2>
              <p className="text-yellow-700 mb-3">
                Your profile is created, but payment is pending.
                Complete payment to activate your membership.
              </p>

              <button
                onClick={goToPayment}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition mb-2"
              >
                Complete Payment
              </button>

              <p
                className="text-yellow-700 underline cursor-pointer text-sm"
                onClick={goToPayment}
              >
                Click here to finish your payment →
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
