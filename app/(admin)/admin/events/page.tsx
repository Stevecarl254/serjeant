"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type EventStatus = "Upcoming" | "Past";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  status: EventStatus;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Annual Meeting",
      date: "2025-12-25",
      location: "Main Hall",
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Community Outreach",
      date: "2025-09-15",
      location: "City Center",
      status: "Past",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    status: "Upcoming" as EventStatus,
  });

  // Open modal for new event
  const openModal = () => {
    setEditingEvent(null);
    setFormData({ title: "", date: "", location: "", status: "Upcoming" });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({ ...event });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Update
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEvent.id ? { ...formData, id: editingEvent.id } : ev))
      );
    } else {
      // Add new
      setEvents((prev) => [
        ...prev,
        { ...formData, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
      ]);
    }
    closeModal();
  };

  const deleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#002366]">Events Management</h1>
        <button
          onClick={openModal}
          className="flex items-center bg-[#002366] hover:bg-[#9e9210] text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaPlus className="mr-2" /> Add Event
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm bg-white">
          <thead className="bg-[#002366] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{ev.title}</td>
                <td className="px-4 py-2">{ev.date}</td>
                <td className="px-4 py-2">{ev.location}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white font-medium ${
                      ev.status === "Upcoming" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {ev.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => editEvent(ev)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteEvent(ev.id)}
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
              {editingEvent ? "Edit Event" : "Add Event"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Event Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <input
                type="text"
                placeholder="Location *"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Past">Past</option>
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
                  {editingEvent ? "Update" : "Create"}
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