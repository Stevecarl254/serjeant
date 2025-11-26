"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Resource {
  _id: string;
  title: string;
  type: "PDF" | "Link";
  category: string;
  fileUrl: string;
  description?: string;
}

const categories = ["Bylaws", "Standing Orders", "Constitution", "Strategic Plan", "PCS Act 2019"];

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState<Resource>({
    _id: "",
    title: "",
    type: "PDF",
    category: "",
    fileUrl: "",
    description: "",
  });

  const [uploading, setUploading] = useState(false);

  // Load resources
  useEffect(() => {
    async function loadResources() {
      try {
        const res = await fetch("/api/admin/resources");
        const data = await res.json();
        if (Array.isArray(data.resources)) setResources(data.resources);
      } catch (error) {
        console.error("Failed to load resources", error);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  // Upload PDF
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/admin/resources/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.fileUrl) {
        setNewResource({ ...newResource, fileUrl: data.fileUrl });
      } else {
        console.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Add resource
  const addResource = async () => {
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResource),
      });
      const data = await res.json();
      if (res.ok && data.resource) {
        setResources((prev) => [data.resource, ...prev]);
        setShowAddModal(false);
        setNewResource({ _id: "", title: "", type: "PDF", category: "", fileUrl: "", description: "" });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete resource
  const deleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r._id !== id));
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Public Resources</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          + Add Resource
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Link/File</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Loading resources...
                </td>
              </tr>
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No resources found.
                </td>
              </tr>
            ) : (
              resources.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{r.title}</td>
                  <td className="p-4">{r.type}</td>
                  <td className="p-4">{r.category}</td>
                  <td className="p-4">
                    <a href={r.fileUrl} target="_blank" className="text-blue-600 hover:underline">
                      {r.type === "PDF" ? "Open PDF" : "Open Link"}
                    </a>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteResource(r._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-white/95 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-4">
            <h2 className="text-xl font-semibold">Add New Resource</h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full border p-3 rounded-lg"
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            />

            <select
              value={newResource.type}
              onChange={(e) => setNewResource({ ...newResource, type: e.target.value as "PDF" | "Link" })}
              className="w-full border p-3 rounded-lg"
            >
              <option value="PDF">PDF</option>
              <option value="Link">Link</option>
            </select>

            <select
              value={newResource.category}
              onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {newResource.type === "PDF" && (
              <div>
                <input type="file" accept="application/pdf" onChange={handleFileUpload} />
                {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
              </div>
            )}

            {newResource.type === "Link" && (
              <input
                type="text"
                placeholder="Link URL"
                className="w-full border p-3 rounded-lg"
                value={newResource.fileUrl}
                onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
              />
            )}

            <textarea
              placeholder="Description (optional)"
              className="w-full border p-3 rounded-lg"
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addResource}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={newResource.type === "PDF" && !newResource.fileUrl}
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}