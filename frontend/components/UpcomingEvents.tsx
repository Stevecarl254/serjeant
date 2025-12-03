"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../lib/axiosInstance";
import { FaCalendarAlt, FaFilter } from "react-icons/fa";

type EventItem = {
  _id: string;
  title: string;
  location?: string;
  date?: string;
  time?: string;
  category?: string;
  description?: string;
};

const monthNames = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
];

export default function UpcomingEvents() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  // --- State ---
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventsUrl, setEventsUrl] = useState("/api/events/public");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all"|"future"|"past">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState("");

  // --- Component mounted log ---
  useEffect(() => {
    console.log("[DEBUG] UpcomingEvents component mounted");
  }, []);

  // --- Determine URL safely, even without localStorage ---
  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const membershipActive = typeof window !== "undefined" && localStorage.getItem("membershipActive") === "true";

      if(token) {
        setEventsUrl(membershipActive ? "/api/events/member" : "/api/events/user");
      } else {
        setEventsUrl("/api/events/public");
      }
    } catch(e) {
      console.warn("[WARN] Could not access localStorage, defaulting to public events");
      setEventsUrl("/api/events/public");
    }
  }, []);

  // --- Fetch events with debug logs and fallback ---
  useEffect(() => {
    if(!eventsUrl) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      console.log("[DEBUG] Fetching events from URL:", eventsUrl, "page:", page, "year:", currentYear);

      const params: any = { page };
      if(eventsUrl.includes("/member") || eventsUrl.includes("/user")) params.year = currentYear;

      try {
        let res = await axiosInstance.get(eventsUrl, { params });
        console.log("[DEBUG] Backend response:", res.data);

        let dataArray: any[] = Array.isArray(res.data) ? res.data : res.data.events || [];
        let pages = res.data.totalPages || 1;

        // Fallback if authenticated route has nothing
        if((eventsUrl.includes("/user") || eventsUrl.includes("/member")) && dataArray.length === 0) {
          console.warn("[WARN] No member/user events, retrying /api/events/public");
          res = await axiosInstance.get("/api/events/public", { params: { page } });
          console.log("[DEBUG] Public fallback response:", res.data);
          dataArray = res.data.events || [];
          pages = res.data.totalPages || 1;
        }

        const mapped: EventItem[] = dataArray.map(e => ({
          _id: e._id,
          title: e.title,
          location: e.location || "",
          date: e.date ? new Date(e.date).toISOString() : undefined,
          time: e.time,
          category: e.category,
          description: e.description,
        }));

        console.log("[DEBUG] Final mapped events:", mapped);

        setEvents(mapped);
        setTotalPages(pages);
      } catch(err: any) {
        console.error("[ERROR] Failed to fetch events:", err.message || err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [eventsUrl, page, currentYear]);

  // --- Helpers ---
  const isPastISO = (iso: string) => iso < todayISO;
  const isFutureISO = (iso: string) => iso >= todayISO;

  const filteredEvents = useMemo(() => {
    let list = [...events];
    const q = searchQuery.trim().toLowerCase();

    if(q.length) {
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.location||"").toLowerCase().includes(q) ||
        (e.category||"").toLowerCase().includes(q)
      );
    }

    if(selectedDate) {
      list = list.filter(e => e.date?.slice(0,10) === selectedDate);
      return list.sort((a,b) => (a.date||"").localeCompare(b.date||""));
    }

    if(selectedFilter === "future" || selectedFilter === "all")
      list = list.filter(e => e.date && isFutureISO(e.date));
    else if(selectedFilter === "past")
      list = list.filter(e => e.date && isPastISO(e.date));

    return list.sort((a,b) => (a.date||"").localeCompare(b.date||""));
  }, [events, selectedFilter, searchQuery, selectedDate]);

  const formatISO = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
  };

  // --- UI helpers ---
  const toggleCalendar = () => setCalendarOpen(v => { const nv = !v; if(nv) setFilterOpen(false); return nv; });
  const toggleFilter = () => setFilterOpen(v => { const nv = !v; if(nv) setCalendarOpen(false); return nv; });
  const handleDateClick = (iso: string) => setSelectedDate(selectedDate === iso ? "" : iso);
  const goToPreviousMonth = () => currentMonth === 0 ? (setCurrentYear(y => y-1), setCurrentMonth(11)) : setCurrentMonth(m => m-1);
  const goToNextMonth = () => currentMonth === 11 ? (setCurrentYear(y => y+1), setCurrentMonth(0)) : setCurrentMonth(m => m+1);

  // --- Render ---
  return (
    <section className="relative w-full bg-white text-gray-900 py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
          <h2 className="text-2xl md:text-3xl font-bold">
            Upcoming Events - {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210] w-full md:w-64"
            />
            <button onClick={toggleCalendar} aria-expanded={calendarOpen} className="flex items-center gap-2 px-4 py-2 bg-[#002366] text-white rounded-lg shadow-md hover:shadow-lg transition">
              <FaCalendarAlt /><span className="hidden sm:inline">Calendar</span>
            </button>
            <button onClick={toggleFilter} aria-expanded={filterOpen} className="flex items-center gap-2 px-4 py-2 bg-[#9e9210] text-white rounded-lg shadow-md hover:shadow-lg transition">
              <FaFilter /><span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Events list */}
        {loading ? <p>Loading...</p> :
         error ? <p className="text-red-500">{error}</p> :
         filteredEvents.length === 0 ? (
           <div className="text-center py-16 border rounded-lg border-dashed border-gray-300">
             <p className="text-gray-400 text-lg md:text-xl">No Events</p>
           </div>
         ) :
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map(ev => {
            const iso = ev.date?.slice(0,10) || "";
            const isPast = iso && isPastISO(iso);
            return (
              <div key={ev._id} className={`p-4 rounded-lg shadow hover:shadow-md transition bg-white border ${isPast?"opacity-80":""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#002366]">{ev.title}</h3>
                    <p className="text-sm text-gray-600">{ev.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{formatISO(iso)}</div>
                    {ev.time && <div className="text-sm text-gray-500">{ev.time}</div>}
                  </div>
                </div>
                {ev.description && <p className="mt-3 text-sm text-gray-700">{ev.description}</p>}
              </div>
            )
          })}
         </div>
        }

        {/* Pagination */}
        {(page > 1 || page < totalPages) && (
          <div className="flex justify-center gap-4 mt-6">
            <button disabled={page===1} onClick={()=>setPage(p => p-1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
            <span>Page {page} / {totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(p => p+1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </section>
  );
}
