"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  packageType: string;
  isActive: boolean;
  paymentConfirmed: boolean;
  membershipNumber: string;
  createdAt: string;
}

export default function MemberProfile() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("memberId");
    if (!id) {
      console.error("No memberId found in localStorage.");
      router.push("/Membership/register/standard");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/public/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMember(data.member);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch member:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  const secretary = {
    role: "Secretary",
    name: "Ms. Faith Kamori",
    description: "Serjeant-at-arms Nyandarua",
    color: "bg-[#7e7411]"
  };

  const canDownload = member.paymentConfirmed === true;

  const downloadCertificate = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/members/${member._id}/certificate`;
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg shadow-lg"
      >
        ← Back
      </button>

      <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg rounded-2xl p-10 mt-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 border-b pb-8">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-green-600"
          />

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">{member.fullName}</h1>
            <p className="text-green-600 font-semibold mt-1">
              {member.paymentConfirmed ? "Active Member" : "Pending Payment"}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Member ID: {member.membershipNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 text-gray-700">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <p><strong>Name:</strong> {member.fullName}</p>
            <p><strong>Email:</strong> {member.email}</p>
            <p><strong>Phone:</strong> {member.phone}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Membership Details</h2>
            <p><strong>Type:</strong> {member.packageType}</p>
            <p><strong>Status:</strong> {member.paymentConfirmed ? "Paid" : "Not Paid"}</p>
            <p><strong>Joined:</strong> {new Date(member.createdAt).toDateString()}</p>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Activity & History</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Last Payment: {member.paymentConfirmed ? "Verified" : "N/A"}</li>
              <li>3 Meetings Attended This Month</li>
              <li>Has Downloaded 4 Receipts</li>
            </ul>
          </div>

          {/* Certificate */}
          {canDownload && (
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Membership Certificate</h2>
              <button
                onClick={downloadCertificate}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Download Certificate
              </button>

              <p className="mt-2 text-sm text-gray-600">
                Signed by: {secretary.name}, {secretary.role} — {secretary.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
