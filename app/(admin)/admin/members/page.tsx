"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", role: "Member" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321", role: "Admin" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "" });

  const openModal = () => {
    setEditingMember(null);
    setFormData({ name: "", email: "", phone: "", role: "" });
    setIsModalOpen(true);
  };

  const editMember = (member: Member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? { ...formData, id: editingMember.id } : m))
      );
    } else {
      setMembers((prev) => [
        ...prev,
        { ...formData, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
      ]);
    }
    closeModal();
  };

  const deleteMember = (id: number) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#002366]">Members Management</h1>
        <button
          onClick={openModal}
          className="flex items-center bg-[#002366] hover:bg-[#9e9210] text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaPlus className="mr-2" /> Add Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm bg-white">
          <thead className="bg-[#002366] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{member.name}</td>
                <td className="px-4 py-2">{member.email}</td>
                <td className="px-4 py-2">{member.phone}</td>
                <td className="px-4 py-2">{member.role}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => editMember(member)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-slide-in">
            <h2 className="text-2xl font-bold mb-4 text-[#002366]">
              {editingMember ? "Edit Member" : "Add Member"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <input
                type="text"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </select>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002366] text-white rounded-lg hover:bg-[#9e9210] transition"
                >
                  {editingMember ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}