"use client";

import { useEffect, useState, ChangeEvent } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface CouncilMember {
  _id: string;
  fullName: string;
  role: string;
  phone?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  photoUrl?: string;
  isSecretary?: boolean;
  active?: boolean;
}

export default function CouncilPage() {
  const [council, setCouncil] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newMember, setNewMember] = useState({
    fullName: "",
    role: "",
    phone: "",
    startDate: "",
    endDate: "",
  });

  // file selected for add
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);

  const [editMember, setEditMember] = useState<CouncilMember | null>(null);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

  // Load council members
  useEffect(() => {
    fetchCouncil();
    // cleanup previews on unmount
    return () => {
      if (newPhotoPreview) URL.revokeObjectURL(newPhotoPreview);
      if (editPhotoPreview) URL.revokeObjectURL(editPhotoPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCouncil = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/council");
      const payload = res.data?.council ?? res.data ?? [];
      setCouncil(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Failed to load council:", err);
      setCouncil([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Helpers: build FormData
  // -----------------------
  const buildFormData = (fields: Record<string, any>, file?: File | null) => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      // Skip null/empty strings for nicer payloads
      if (v === undefined || v === null) return;
      if (typeof v === "string" && v.trim() === "") return;
      fd.append(k, v);
    });
    if (file) fd.append("photo", file);
    return fd;
  };

  // -----------------------
  // Add Council Member
  // -----------------------
  const handleNewPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewPhoto(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setNewPhotoPreview(url);
    } else {
      if (newPhotoPreview) {
        URL.revokeObjectURL(newPhotoPreview);
        setNewPhotoPreview(null);
      }
    }
  };

  const addCouncilMember = async () => {
    try {
      const fd = buildFormData(newMember, newPhoto);
      const res = await axiosInstance.post("/council", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = res.data?.member ?? null;
      if (created) {
        setCouncil((prev) => [...prev, created]);
        setShowAddModal(false);
        setNewMember({ fullName: "", role: "", phone: "", startDate: "", endDate: "" });
        setNewPhoto(null);
        if (newPhotoPreview) {
          URL.revokeObjectURL(newPhotoPreview);
          setNewPhotoPreview(null);
        }
      } else {
        // sometimes backend might return raw member
        if (res.data?._id) {
          setCouncil((prev) => [...prev, res.data]);
        }
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Failed to add council member:", err);
      // Optionally display a toast
    }
  };

  // -----------------------
  // Edit member
  // -----------------------
  const openEdit = (m: CouncilMember) => {
    setEditMember(m);
    setShowEditModal(true);
    setEditPhoto(null);
    setEditPhotoPreview(m.photoUrl ?? null);
  };

  const handleEditPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEditPhoto(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setEditPhotoPreview(url);
    }
  };

  const saveEdit = async () => {
    if (!editMember) return;

    try {
      // build formdata from editMember fields
      const payload: Record<string, any> = {
        fullName: editMember.fullName,
        role: editMember.role,
        phone: editMember.phone ?? "",
        startDate: editMember.startDate ?? "",
        endDate: editMember.endDate ?? "",
      };

      const fd = buildFormData(payload, editPhoto);
      const res = await axiosInstance.put(`/council/${editMember._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data?.member ?? res.data;
      if (updated) {
        setCouncil((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
        setShowEditModal(false);
        setEditMember(null);
        if (editPhotoPreview) {
          URL.revokeObjectURL(editPhotoPreview);
          setEditPhotoPreview(null);
        }
        setEditPhoto(null);
      }
    } catch (err) {
      console.error("Error editing council member:", err);
    }
  };

  // -----------------------
  // Delete
  // -----------------------
  const deleteMember = async (id: string) => {
    if (!confirm("Delete this council member?")) return;
    try {
      await axiosInstance.delete(`/council/${id}`);
      setCouncil((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // -----------------------
  // Set as Secretary
  // -----------------------
  const setAsSecretary = async (id: string) => {
    if (!confirm("Make this member the Secretary? This will unset any existing Secretary.")) return;
    try {
      // backend endpoint should be: PATCH /council/:id/secretary
      const res = await axiosInstance.patch(`/council/${id}/secretary`);
      const updated = res.data?.member ?? res.data;
      if (updated) {
        // re-fetch to sync all isSecretary flags
        fetchCouncil();
      } else {
        fetchCouncil();
      }
    } catch (err) {
      console.error("Failed to set secretary:", err);
      // fallback: refresh list
      fetchCouncil();
    }
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Council Members</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2 rounded-lg bg-[#002366] text-white hover:bg-[#9e9210] transition"
        >
          + Add Council Member
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Photo</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Start</th>
              <th className="p-4 text-left">End</th>
              <th className="p-4 text-left">Secretary</th>
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
            ) : council.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No council members found.
                </td>
              </tr>
            ) : (
              council.map((m) => (
                <tr key={m._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm">No</div>
                    )}
                  </td>

                  <td className="p-4">{m.fullName}</td>
                  <td className="p-4">{m.role}</td>
                  <td className="p-4">{m.phone ?? "—"}</td>
                  <td className="p-4">{m.startDate ? new Date(m.startDate).toLocaleDateString() : "—"}</td>
                  <td className="p-4">{m.endDate ? new Date(m.endDate).toLocaleDateString() : "—"}</td>

                  <td className="p-4">
  {m.isSecretary ? (
    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Secretary</span>
  ) : (
    "—"
  )}
</td>

                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => openEdit(m)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMember(m._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
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

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Add Council Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-600">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newMember.fullName}
                onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Role (e.g., Chairperson)"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <div className="flex gap-3">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={newMember.startDate}
                  onChange={(e) => setNewMember({ ...newMember, startDate: e.target.value })}
                  className="w-1/2 border p-3 rounded-lg"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={newMember.endDate}
                  onChange={(e) => setNewMember({ ...newMember, endDate: e.target.value })}
                  className="w-1/2 border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo (optional)</label>
                <input type="file" accept="image/*" onChange={handleNewPhoto} />
                {newPhotoPreview && (
                  <img src={newPhotoPreview} alt="preview" className="w-24 h-24 mt-2 object-cover rounded" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={addCouncilMember} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editMember && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Edit Member</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-600">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={editMember.fullName}
                onChange={(e) => setEditMember({ ...editMember, fullName: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                value={editMember.role}
                onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                value={editMember.phone ?? ""}
                onChange={(e) => setEditMember({ ...editMember, phone: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <div className="flex gap-3">
                <input
                  type="date"
                  value={(editMember.startDate || "").split("T")[0]}
                  onChange={(e) => setEditMember({ ...editMember, startDate: e.target.value })}
                  className="w-1/2 border p-3 rounded-lg"
                />
                <input
                  type="date"
                  value={(editMember.endDate || "").split("T")[0]}
                  onChange={(e) => setEditMember({ ...editMember, endDate: e.target.value })}
                  className="w-1/2 border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo (optional)</label>
                <input type="file" accept="image/*" onChange={handleEditPhoto} />
                {editPhotoPreview && (
                  <img src={editPhotoPreview} alt="preview" className="w-24 h-24 mt-2 object-cover rounded" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
