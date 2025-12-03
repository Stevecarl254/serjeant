"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";

interface Event {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  time: string;
  location: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/events", {
          params: { page: 1, limit: 3 },
        });
        setEvents(res.data.events || []);
      } catch {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 bg-gray-100" id="upcoming-events">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>

        {loading && <p className="text-center text-gray-500">Loading events…</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="text-center text-gray-500">No upcoming events available.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                <p className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString()} – {event.time}
                </p>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && events.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              href="/events"
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Show More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
