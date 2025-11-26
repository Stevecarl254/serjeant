"use client";

import React, { useState, useEffect } from "react";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  year: number;
}

const categoryColors: Record<string, string> = {
  Ceremony: "bg-[#9e9210]",
  Meeting: "bg-[#002366]",
  Workshop: "bg-[#00a86b]",
  Default: "bg-gray-500",
};

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    image: "",
    category: "",
    year: new Date().getFullYear(),
  });

  // Fetch all gallery items
  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/admin/gallery");
        const data = await res.json();
        setGallery(data.items || []);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Add new item
  const addItem = async () => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (res.ok) {
        setGallery((prev) => [data.item, ...prev]);
        setShowModal(false);
        setNewItem({ title: "", image: "", category: "", year: new Date().getFullYear() });
      } else {
        alert(data.message || "Error adding item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) setGallery((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#002366]">Admin Gallery</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Item
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <p>Loading gallery...</p>
      ) : gallery.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item._id} className="relative bg-white shadow rounded-2xl overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
              <span
                className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold text-white rounded-full ${
                  categoryColors[item.category] || categoryColors.Default
                }`}
              >
                {item.category}
              </span>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-500">{item.year}</p>
                </div>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-white">
          <div className="w-full max-w-lg space-y-4">
            <h2 className="text-xl font-semibold">Add Gallery Item</h2>

            <input
              type="text"
              placeholder="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full border p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              className="w-full border p-3 rounded-lg"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Category</option>
              <option value="Ceremony">Ceremony</option>
              <option value="Meeting">Meeting</option>
              <option value="Workshop">Workshop</option>
            </select>
            <input
              type="number"
              placeholder="Year"
              value={newItem.year}
              onChange={(e) => setNewItem({ ...newItem, year: Number(e.target.value) })}
              className="w-full border p-3 rounded-lg"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={addItem} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}