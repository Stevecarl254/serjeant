"use client";

import { useEffect, useState } from "react";

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    isActive: true,
  });

  // Fetch all events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/admin/events");
        const data = await res.json();
        if (Array.isArray(data.events)) setEvents(data.events);
        else setEvents([]);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Add Event
  const addEvent = async () => {
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();

      if (res.ok && data.event) {
        setEvents((prev) => [...prev, data.event]);
        setShowModal(false);
        setNewEvent({
          title: "",
          description: "",
          location: "",
          date: "",
          time: "",
          isActive: true,
        });
      } else {
        console.error("Error creating event:", data.message);
      }
    } catch (err) {
      console.error("Error creating event", err);
    }
  };

  // Delete Event
  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
      } else {
        console.error("Failed to delete event");
      }
    } catch (err) {
      console.error("Error deleting event", err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Events</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          + Add Event
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Time</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading events...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{e.title}</td>
                  <td className="p-4">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="p-4">{e.time}</td>
                  <td className="p-4">{e.location}</td>
                  <td className="p-4">
                    {e.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => deleteEvent(e._id)}
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

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-white/95">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold">Add New Event</h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full border p-3 rounded-lg"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full border p-3 rounded-lg"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full border p-3 rounded-lg"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
            />
            <div className="flex gap-4">
              <input
                type="date"
                className="w-full border p-3 rounded-lg"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
              />
              <input
                type="time"
                className="w-full border p-3 rounded-lg"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newEvent.isActive}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, isActive: e.target.checked })
                }
              />
              Active
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}