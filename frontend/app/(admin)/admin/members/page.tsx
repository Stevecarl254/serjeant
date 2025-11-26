"use client";

import { useEffect, useState } from "react";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  packageType: string;
  isActive: boolean;
  createdAt: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    fullName: "",
    email: "",
    phone: "",
    packageType: "",
  });

  // Fetch Members
  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/members");
        const data = await res.json();

        // Extract members array safely
        const membersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.members)
          ? data.members
          : [];
        setMembers(membersArray);
      } catch (error) {
        console.error("Failed to load members", error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  // Add Member Handler
  const addMember = async () => {
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      const data = await res.json();

      if (res.ok && data.member) {
        setMembers((prev) => [...prev, data.member]);
        setShowAddModal(false);
        setNewMember({ fullName: "", email: "", phone: "", packageType: "" });
      } else {
        console.error("Error adding member:", data.message);
      }
    } catch (error) {
      console.error("Error adding member", error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Members Management</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          + Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Package</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  Loading members...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{m.fullName}</td>
                  <td className="p-4">{m.email}</td>
                  <td className="p-4">{m.phone}</td>
                  <td className="p-4">{m.packageType}</td>
                  <td className="p-4">
                    {m.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Fullscreen Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-white overflow-auto">
          <div className="bg-white w-full h-full max-w-5xl rounded-xl shadow-lg p-8 space-y-6 overflow-auto">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Member
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-3 rounded-lg"
                value={newMember.fullName}
                onChange={(e) =>
                  setNewMember({ ...newMember, fullName: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded-lg"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border p-3 rounded-lg"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
              />

              <select
                className="w-full border p-3 rounded-lg"
                value={newMember.packageType}
                onChange={(e) =>
                  setNewMember({ ...newMember, packageType: e.target.value })
                }
              >
                <option value="">Select Package</option>
                <option value="Bronze">Bronze – 500 KES</option>
                <option value="Silver">Silver – 1,000 KES</option>
                <option value="Gold">Gold – 2,000 KES</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addMember}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}