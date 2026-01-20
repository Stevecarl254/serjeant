"use client";

import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

type EventItem = {
  _id: string;
  title: string;
  location: string;
  dateISO: string; // "YYYY-MM-DD"
  time?: string;
  category?: string;
  description?: string;
  isActive?: boolean;
};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Community": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  "Charity":   { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  "Training":  { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  "Gala":      { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  "Outreach":  { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  "Conference":{ bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  "Other":     { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
};

const getCategoryClass = (cat?: string) => {
  if (!cat) cat = "Other";
  const key = Object.keys(CATEGORY_STYLES).find(k => k.toLowerCase() === cat!.toLowerCase()) || "Other";
  const s = CATEGORY_STYLES[key];
  return `${s.bg} ${s.text} ${s.border}`;
};

export default function EventsPage() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all"|"future"|"past">("all");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/events", { params: { page: 1, limit: 50 } });
        const data = res.data.events || [];
        const mapped: EventItem[] = data.map((e: any) => ({
          _id: e._id,
          title: e.title,
          location: e.location,
          dateISO: e.date, // ISO from backend
          time: e.time || "",
          category: e.category || "Other",
          description: e.description || "",
          isActive: e.isActive ?? true,
        }));
        mapped.sort((a,b) => a.dateISO.localeCompare(b.dateISO));
        setEvents(mapped);
      } catch (err:any) {
        console.error(err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filtering
  const isPastISO = (iso: string) => iso < todayISO;
  const isFutureISO = (iso: string) => iso >= todayISO;

  const filteredEvents = useMemo(() => {
    let list = [...events];
    if (selectedFilter === "future") list = list.filter(e => isFutureISO(e.dateISO));
    else if (selectedFilter === "past") list = list.filter(e => isPastISO(e.dateISO));

    const q = searchQuery.trim().toLowerCase();
    if (q) list = list.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || (e.category||"").toLowerCase().includes(q));

    if (selectedDate) list = list.filter(e => e.dateISO === selectedDate);

    return list.sort((a,b) => a.dateISO.localeCompare(b.dateISO));
  }, [events, selectedFilter, searchQuery, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const paginated = filteredEvents.slice((page-1)*pageSize, page*pageSize);

  // Calendar
  const getDaysInMonth = (month:number, year:number) => new Date(year, month+1,0).getDate();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = Array.from({ length: firstDay });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    events.forEach(e => {
      if (selectedFilter==="future" && isPastISO(e.dateISO)) return;
      if (selectedFilter==="past" && isFutureISO(e.dateISO)) return;
      if (!map.has(e.dateISO)) map.set(e.dateISO, []);
      map.get(e.dateISO)!.push(e);
    });
    return map;
  }, [events, selectedFilter]);

  const formatISO = (iso:string) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
    } catch { return iso; }
  };

  return (
    <section className="relative w-full bg-white text-gray-900 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header + actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">{monthNames[currentMonth]} {currentYear} Events</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              className="px-3 py-2 border rounded-md w-full md:w-64"
              placeholder="Search title, location or category..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            />
            <button onClick={() => { setCalendarOpen(v=>!v); if(!calendarOpen) setFilterOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 bg-[#002366] text-white rounded-md shadow-sm">Calendar</button>
            <button onClick={() => { setFilterOpen(v=>!v); if(!filterOpen) setCalendarOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 bg-[#9e9210] text-white rounded-md shadow-sm">Filter</button>
          </div>
        </div>

        {/* Filters */}
        {filterOpen && (
          <div className="p-4 border rounded-md bg-gray-50 flex gap-4 flex-wrap items-center">
            <label className="flex items-center gap-2"><input type="radio" checked={selectedFilter==="all"} onChange={()=>setSelectedFilter("all")} />All</label>
            <label className="flex items-center gap-2"><input type="radio" checked={selectedFilter==="future"} onChange={()=>setSelectedFilter("future")} />Future</label>
            <label className="flex items-center gap-2"><input type="radio" checked={selectedFilter==="past"} onChange={()=>setSelectedFilter("past")} />Past</label>
          </div>
        )}

        {/* Calendar */}
        {calendarOpen && (
          <div className="p-4 border rounded-md bg-white">
            <div className="grid grid-cols-7 gap-2 text-sm text-center mb-2 font-semibold text-gray-600">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {blanks.map((_,i)=><div key={`b${i}`} className="p-2"></div>)}
              {Array.from({length:daysInMonth}).map((_,idx)=>{
                const day=idx+1;
                const iso=`${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const dayEvents = eventsByDate.get(iso) || [];
                const isToday = iso===todayISO;
                return (
                  <div key={iso} className={`relative p-2 rounded-md cursor-pointer transition ${isToday?"border border-[#9e9210]":""}`}
                       onClick={()=>setSelectedDate(prev=>prev===iso?"":iso)}>
                    <div className="text-sm text-left">{day}</div>
                    <div className="flex gap-1 justify-center mt-2">
                      {dayEvents.slice(0,3).map(evt=>{
                        const style=CATEGORY_STYLES[evt.category||"Other"];
                        return <div key={evt._id} className={`w-2 h-2 rounded-full ${style.bg.replace("bg-","bg-")}`} title={evt.title} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Events list */}
        <div className="p-4 border rounded-md bg-white">
          {loading ? <div className="py-8 text-center text-gray-500">Loading events…</div> :
           error ? <div className="py-8 text-center text-red-600">{error}</div> :
           paginated.length===0 ? <div className="py-8 text-center text-gray-500">No events</div> :
           <div className="grid md:grid-cols-2 gap-4">
            {paginated.map(ev => (
              <div key={ev._id} className="p-4 border rounded-md bg-white shadow-sm flex flex-col">
                <div>
                  <div className="text-lg font-semibold text-[#002366]">{ev.title}</div>
                  <div className="text-sm text-gray-600">{ev.location}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryClass(ev.category)}`}>{ev.category}</span>
                    <span className="text-xs text-gray-500">{formatISO(ev.dateISO)}{ev.time?` • ${ev.time}`:""}</span>
                  </div>
                </div>
                {ev.description && <div className="mt-2 text-sm text-gray-700">{ev.description}</div>}
              </div>
            ))}
           </div>
          }

          {/* Pagination */}
          {paginated.length>0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing {(page-1)*pageSize+1}-{Math.min(page*pageSize, filteredEvents.length)} of {filteredEvents.length}</div>
              <div className="flex items-center gap-2">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border rounded" disabled={page===1}>Prev</button>
                <div className="px-3 text-sm">Page {page}/{totalPages}</div>
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 border rounded" disabled={page===totalPages}>Next</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
