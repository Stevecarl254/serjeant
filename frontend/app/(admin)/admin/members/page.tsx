"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "../../../../lib/axiosInstance";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  packageType: string;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({
    fullName: "",
    email: "",
    phone: "",
    packageType: "",
    avatar: null as File | null,
  });

  /* ---------------- Fetch Members ---------------- */
  const loadMembers = async () => {
    try {
      const res = await axiosInstance.get("/members");
      setMembers(Array.isArray(res.data) ? res.data : res.data.members || []);
    } catch (err) {
      console.error("Failed to load members:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  /* ---------------- Add Member ---------------- */
  const addMember = async () => {
    try {
      const formData = new FormData();
      Object.entries(newMember).forEach(([key, value]) => {
        if (value) formData.append(key, value as string | Blob);
      });

      const res = await axiosInstance.post("/members", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.member) {
        setMembers((prev) => [...prev, res.data.member]);
        setShowAddModal(false);
        setNewMember({ fullName: "", email: "", phone: "", packageType: "", avatar: null });
      }
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  /* ---------------- Edit Member ---------------- */
  const updateMember = async () => {
    if (!showEditModal) return;

    try {
      const formData = new FormData();
      Object.entries(showEditModal).forEach(([key, value]) => {
        if (value) formData.append(key, value as string | Blob);
      });

      const res = await axiosInstance.put(`/members/${showEditModal._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.member) {
        setMembers((prev) =>
          prev.map((m) => (m._id === showEditModal._id ? res.data.member : m))
        );
        setShowEditModal(null);
      }
    } catch (err) {
      console.error("Error updating member:", err);
    }
  };

  /* ---------------- Delete Member ---------------- */
  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await axiosInstance.delete(`/members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Members Management</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/council"
            className="px-5 py-2 rounded-lg bg-[#002366] text-white hover:bg-[#9e9210] transition"
          >
            Council
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            + Add Member
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Avatar</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Package</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.fullName} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    )}
                  </td>
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
                  <td className="p-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => setShowEditModal(m)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMember(m._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <MemberModal
          title="Add New Member"
          member={newMember}
          setMember={setNewMember}
          onClose={() => setShowAddModal(false)}
          onSave={addMember}
        />
      )}

      {/* Edit Member Modal */}
      {showEditModal && (
        <MemberModal
          title="Edit Member"
          member={showEditModal}
          setMember={setShowEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={updateMember}
        />
      )}
    </div>
  );
}

/* ---------------- Member Modal ---------------- */
interface MemberModalProps {
  title: string;
  member: any;
  setMember: (val: any) => void;
  onClose: () => void;
  onSave: () => void;
}

function MemberModal({ title, member, setMember, onClose, onSave }: MemberModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-white overflow-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-8 space-y-6 overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={member.fullName || ""}
            onChange={(e) => setMember({ ...member, fullName: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={member.email || ""}
            onChange={(e) => setMember({ ...member, email: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={member.phone || ""}
            onChange={(e) => setMember({ ...member, phone: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />
          <select
            value={member.packageType || ""}
            onChange={(e) => setMember({ ...member, packageType: e.target.value })}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Package</option>
            <option value="Bronze">Bronze – 500 KES</option>
            <option value="Silver">Silver – 1,000 KES</option>
            <option value="Gold">Gold – 2,000 KES</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMember({ ...member, avatar: e.target.files?.[0] || null })}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={onSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
