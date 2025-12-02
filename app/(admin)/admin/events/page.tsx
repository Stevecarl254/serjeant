"use client";

import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  FaCalendarAlt,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

/**
 * Admin Events page
 * - List + pagination
 * - Create/Edit/Delete
 * - Category filter + color tags
 * - Calendar with dots and drag & drop (drag event card -> calendar date to move it)
 *
 * Notes:
 * - Expects admin endpoints under /admin/events (GET /, POST /, PUT /:id, DELETE /:id)
 * - Event schema expected (backend): { _id, title, location, date (YYYY-MM-DD), time, category, description, isActive }
 */

type EventItem = {
  id: string;
  _raw?: any; // raw backend object if needed
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

/* Category -> Tailwind style mapping */
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Community": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  "Charity":   { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  "Training":  { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  "Gala":      { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  "Outreach":  { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  "Conference":{ bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  "Other":     { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
};

/* Utility to get style class for a category */
const getCategoryClass = (cat?: string) => {
  if (!cat) cat = "Other";
  const key = Object.keys(CATEGORY_STYLES).find(k => k.toLowerCase() === cat!.toLowerCase()) || "Other";
  const s = CATEGORY_STYLES[key];
  return `${s.bg} ${s.text} ${s.border}`;
};

export default function EventsPage() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  // UI states
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all"|"future"|"past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>("");

  // events + loading + error
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // add/edit modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    category: "",
    description: "",
    isActive: true,
  });

  // delete confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  // category filters available (computed from events)
  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => set.add(e.category || "Other"));
    return Array.from(set).sort();
  }, [events]);

  /* -------------------- API interactions -------------------- */

  const apiHeaders = () => {
    const token = (typeof window !== "undefined") ? (localStorage.getItem("token") || localStorage.getItem("authToken")) : "";
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // fetch admin events (you used /admin/events)
      const res = await axiosInstance.get("/admin/events", apiHeaders());
      const raw = Array.isArray(res.data) ? res.data : res.data.events || [];
      const mapped: EventItem[] = raw.map((e: any) => ({
        id: e._id,
        _raw: e,
        title: e.title,
        location: e.location || e.venue || "",
        dateISO: e.date, // assume backend returns YYYY-MM-DD
        time: e.time || "",
        category: e.category || "Other",
        description: e.description || "",
        isActive: e.isActive ?? true,
      }));
      // sort ascending by date
      mapped.sort((a,b) => a.dateISO.localeCompare(b.dateISO));
      setEvents(mapped);
    } catch (err:any) {
      console.error("fetchEvents error", err);
      setError(err?.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- Calendar helpers -------------------- */

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = Array.from({ length: firstDay });

  const isPastISO = (iso: string) => iso < todayISO;
  const isFutureISO = (iso: string) => iso >= todayISO;

  // Map events by date for calendar display (respecting selectedFilter)
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    events.forEach(e => {
      if (selectedFilter === "future" && isPastISO(e.dateISO)) return;
      if (selectedFilter === "past" && isFutureISO(e.dateISO)) return;
      if (!map.has(e.dateISO)) map.set(e.dateISO, []);
      map.get(e.dateISO)!.push(e);
    });
    return map;
  }, [events, selectedFilter, todayISO]);

  /* -------------------- Filtering & Pagination -------------------- */

  const filteredEvents = useMemo(() => {
    let list = [...events];

    if (selectedFilter === "future" || selectedFilter === "all") {
      list = list.filter(e => isFutureISO(e.dateISO));
    } else if (selectedFilter === "past") {
      list = list.filter(e => isPastISO(e.dateISO));
    }

    const q = searchQuery.trim().toLowerCase();
    if (q.length) {
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q)
      );
    }

    if (selectedDate) {
      list = list.filter(e => e.dateISO === selectedDate);
    }

    list.sort((a,b) => a.dateISO.localeCompare(b.dateISO));
    return list;
  }, [events, selectedFilter, searchQuery, selectedDate, todayISO]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const paginated = filteredEvents.slice((page-1)*pageSize, page*pageSize);

  /* -------------------- Create / Update / Delete -------------------- */

  const submitCreate = async () => {
    try {
      // basic validation
      if (!newEvent.title || !newEvent.date || !newEvent.location) {
        alert("Please fill title, date and location.");
        return;
      }

      await axiosInstance.post("/admin/events", {
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        date: newEvent.date,
        time: newEvent.time,
        category: newEvent.category || "Other",
        isActive: newEvent.isActive ?? true,
      }, apiHeaders());

      setAddModalOpen(false);
      setNewEvent({ title: "", location: "", date: "", time: "", category: "", description: "", isActive: true });

      await fetchEvents();
      setPage(1); // jump to first page to see new event
    } catch (err) {
      console.error("submitCreate", err);
      alert("Failed to create event.");
    }
  };

  const submitUpdate = async () => {
    if (!editEvent) return;
    try {
      // basic validation
      if (!editEvent.title || !editEvent.date || !editEvent.location) {
        alert("Please fill title, date and location.");
        return;
      }

      await axiosInstance.put(`/admin/events/${editEvent.id}`, {
        title: editEvent.title,
        description: editEvent.description,
        location: editEvent.location,
        date: editEvent.date,
        time: editEvent.time,
        category: editEvent.category || "Other",
        isActive: editEvent.isActive ?? true,
      }, apiHeaders());

      setEditModalOpen(false);
      setEditEvent(null);
      await fetchEvents();
    } catch (err) {
      console.error("submitUpdate", err);
      alert("Failed to update event.");
    }
  };

  const submitDelete = async () => {
    if (!eventToDelete) return;
    try {
      await axiosInstance.delete(`/admin/events/${eventToDelete.id}`, apiHeaders());
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
      await fetchEvents();
    } catch (err) {
      console.error("submitDelete", err);
      alert("Failed to delete event.");
    }
  };

  /* -------------------- Drag & Drop (move event to new date) -------------------- */

  // Drag: store id
  const onDragStart = (e: React.DragEvent, ev: EventItem) => {
    e.dataTransfer.setData("text/plain", ev.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropOnDate = async (e: React.DragEvent, isoDate: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const ev = events.find(x => x.id === id);
    if (!ev) return;

    // If same date do nothing
    if (ev.dateISO === isoDate) return;

    const confirmMove = confirm(`Move "${ev.title}" from ${ev.dateISO} to ${isoDate}?`);
    if (!confirmMove) return;

    try {
      // call update
      await axiosInstance.put(`/admin/events/${id}`, { ...ev, date: isoDate }, apiHeaders());
      await fetchEvents();
      alert("Event moved.");
    } catch (err) {
      console.error("move error", err);
      alert("Failed to move event.");
    }
  };

  const onDragOverDate = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  /* -------------------- Helpers for UI -------------------- */

  const formatISO = (iso: string) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
    } catch {
      return iso;
    }
  };

  const safeCategory = (cat?: string) => {
    if (!cat) return "Other";
    // normalize common synonyms
    const c = cat.trim();
    if (/charit/i.test(c)) return "Charity";
    if (/communi/i.test(c)) return "Community";
    if (/train/i.test(c)) return "Training";
    if (/gala/i.test(c)) return "Gala";
    if (/outreach/i.test(c)) return "Outreach";
    if (/conf/i.test(c)) return "Conference";
    return c;
  };

  /* -------------------- Render -------------------- */

  return (
    <section className="relative w-full bg-white text-gray-900 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header + actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{monthNames[currentMonth]} {currentYear} Events</h1>
            <p className="text-sm text-gray-600 mt-1">Admin events manager — create, edit, delete, and schedule events.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              className="px-3 py-2 border rounded-md w-full md:w-64"
              placeholder="Search title, location or category..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            />

            <div className="flex gap-2 items-center">
              <button onClick={() => { setCalendarOpen(v => !v); if (!calendarOpen) setFilterOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 bg-[#002366] text-white rounded-md shadow-sm">
                <FaCalendarAlt /> <span className="hidden sm:inline">Calendar</span>
              </button>

              <button onClick={() => { setFilterOpen(v => !v); if (!filterOpen) setCalendarOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 bg-[#9e9210] text-white rounded-md shadow-sm">
                <FaFilter /> <span className="hidden sm:inline">Filter</span>
              </button>

              <button onClick={() => { setAddModalOpen(true); setNewEvent({ title: "", location: "", date: todayISO, time: "", category: "", description: "", isActive: true }); }}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md shadow-sm">
                <FaPlus /> <span className="hidden sm:inline">Add Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {filterOpen && (
          <div className="p-4 border rounded-md bg-gray-50">
            <div className="flex gap-4 flex-wrap items-center">
              <label className="flex items-center gap-2">
                <input type="radio" name="filter" checked={selectedFilter==="all"} onChange={() => setSelectedFilter("all")} />
                <span>All (from today)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="filter" checked={selectedFilter==="future"} onChange={() => setSelectedFilter("future")} />
                <span>Future</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="filter" checked={selectedFilter==="past"} onChange={() => setSelectedFilter("past")} />
                <span>Past</span>
              </label>

              <div className="ml-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Categories:</span>
                <button
                  className={`px-2 py-1 rounded text-sm ${selectedFilter==="all" ? "bg-gray-200":""}`}
                  onClick={() => { setSearchQuery(""); setSelectedDate(""); setPage(1); fetchEvents(); }}
                >
                  Reset
                </button>
                {["Community","Charity","Training","Gala","Outreach","Conference","Other"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSearchQuery(""); setSelectedDate(""); setPage(1); setSearchQuery(cat); }}
                    className={`px-2 py-1 rounded text-sm ${getCategoryClass(cat)}`}
                    title={`Filter by ${cat}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        {calendarOpen && (
          <div className="p-4 border rounded-md bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }} className="p-2 rounded hover:bg-gray-100"><FaChevronLeft /></button>
                <div className="font-semibold">{monthNames[currentMonth]} {currentYear}</div>
                <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }} className="p-2 rounded hover:bg-gray-100"><FaChevronRight /></button>
              </div>

              <div className="text-sm text-gray-600">Drag an event card onto a date to move it.</div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm text-center mb-2 font-semibold text-gray-600">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {blanks.map((_,i) => <div key={`b${i}`} className="p-2"></div>)}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const iso = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const dayEvents = eventsByDate.get(iso) || [];
                const isToday = iso === todayISO;
                const isSelected = iso === selectedDate;
                const isPast = isPastISO(iso);
                const bg = isSelected ? "bg-[#002366] text-white" : isPast ? "bg-gray-50 text-gray-400" : "hover:bg-gray-100";

                return (
                  <div key={iso}
                    onDragOver={onDragOverDate}
                    onDrop={(e) => onDropOnDate(e, iso)}
                    onClick={() => setSelectedDate(prev => prev === iso ? "" : iso)}
                    className={`relative p-2 rounded-md cursor-pointer transition ${bg} ${isToday && !isSelected ? "border border-[#9e9210]" : ""}`}>
                    <div className="text-sm text-left">{day}</div>

                    {/* dots / small color indicators for categories (max 3) */}
                    <div className="flex gap-1 justify-center mt-2">
                      {dayEvents.slice(0,3).map((evt, i) => {
                        const cat = safeCategory(evt.category);
                        const key = Object.keys(CATEGORY_STYLES).find(k => k.toLowerCase() === cat.toLowerCase()) || "Other";
                        const style = CATEGORY_STYLES[key];
                        return <div key={evt.id + i} title={evt.title} className={`w-2 h-2 rounded-full ${style.bg.replace("bg-","bg-") === style.bg ? (style.bg.replace("bg-","bg-")) : style.bg}`} style={{ backgroundColor: undefined }} />;
                      })}
                    </div>

                    {/* small list preview */}
                    {dayEvents.length > 0 && (
                      <div className="mt-2 space-y-1 max-h-24 overflow-auto">
                        {dayEvents.map(evt => (
                          <div key={evt.id} className="text-xs text-gray-700 px-2 py-1 rounded bg-white border flex justify-between items-center"
                              draggable
                              onDragStart={(e) => onDragStart(e, evt)}
                          >
                            <div className="truncate">
                              <div className="font-semibold">{evt.title}</div>
                              <div className="text-[11px] text-gray-500">{evt.location}</div>
                            </div>
                            <div className="text-[11px] ml-2 text-gray-500">{evt.time || ""}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Events list (paginated) */}
        <div className="p-4 border rounded-md bg-white">
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading events…</div>
          ) : error ? (
            <div className="py-8 text-center text-red-600">{error}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No events</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {paginated.map(ev => (
                  <div key={ev.id} className="p-4 border rounded-md bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="text-lg font-semibold text-[#002366]">{ev.title}</div>
                        <div className="text-sm text-gray-600">{ev.location}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryClass(safeCategory(ev.category))}`}>
                            {safeCategory(ev.category)}
                          </span>
                          <span className="text-xs text-gray-500">{formatISO(ev.dateISO)}{ev.time ? ` • ${ev.time}` : ""}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-gray-500">{ev.isActive ? "Active" : "Inactive"}</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditEvent({
                                id: ev.id,
                                title: ev.title,
                                location: ev.location,
                                date: ev.dateISO,
                                time: ev.time || "",
                                category: ev.category || "",
                                description: ev.description || "",
                                isActive: ev.isActive ?? true,
                              });
                              setEditModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => { setEventToDelete(ev); setDeleteConfirmOpen(true); }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">{ev.description}</div>

                    {/* Make card draggable so admin can drag to calendar */}
                    <div className="mt-3">
                      <div
                        draggable
                        onDragStart={(e) => onDragStart(e, ev)}
                        className="text-xs text-gray-500 italic"
                      >
                        Drag me to calendar to move date
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* pagination controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <b>{(page-1)*pageSize + 1}</b> - <b>{Math.min(page*pageSize, filteredEvents.length)}</b> of <b>{filteredEvents.length}</b>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={page===1}>Prev</button>
                  <div className="px-3 text-sm">Page {page} / {totalPages}</div>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 border rounded" disabled={page===totalPages}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* ADD Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Add Event</h3>

            <div className="grid gap-3">
              <input className="border p-2 rounded" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent(s => ({...s, title: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent(s => ({...s, location: e.target.value}))} />
              <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" type="date" value={newEvent.date} onChange={e => setNewEvent(s => ({...s, date: e.target.value}))} />
                <input className="border p-2 rounded w-32" type="time" value={newEvent.time} onChange={e => setNewEvent(s => ({...s, time: e.target.value}))} />
              </div>
              <input className="border p-2 rounded" placeholder="Category" value={newEvent.category} onChange={e => setNewEvent(s => ({...s, category: e.target.value}))} />
              <textarea className="border p-2 rounded" placeholder="Description" value={newEvent.description} onChange={e => setNewEvent(s => ({...s, description: e.target.value}))} />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 border rounded" onClick={() => setAddModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={submitCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT Modal */}
      {editModalOpen && editEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Edit Event</h3>

            <div className="grid gap-3">
              <input className="border p-2 rounded" placeholder="Title" value={editEvent.title} onChange={e => setEditEvent((s:any) => ({...s, title: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Location" value={editEvent.location} onChange={e => setEditEvent((s:any) => ({...s, location: e.target.value}))} />
              <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" type="date" value={editEvent.date} onChange={e => setEditEvent((s:any) => ({...s, date: e.target.value}))} />
                <input className="border p-2 rounded w-32" type="time" value={editEvent.time} onChange={e => setEditEvent((s:any) => ({...s, time: e.target.value}))} />
              </div>
              <input className="border p-2 rounded" placeholder="Category" value={editEvent.category} onChange={e => setEditEvent((s:any) => ({...s, category: e.target.value}))} />
              <textarea className="border p-2 rounded" placeholder="Description" value={editEvent.description} onChange={e => setEditEvent((s:any) => ({...s, description: e.target.value}))} />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!editEvent.isActive} onChange={e => setEditEvent((s:any) => ({...s, isActive: e.target.checked}))} />
                Active
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 border rounded" onClick={() => { setEditModalOpen(false); setEditEvent(null); }}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submitUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE confirm */}
      {deleteConfirmOpen && eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-red-600 mb-3">Confirm Delete</h3>
            <p>Are you sure you want to delete <b>{eventToDelete.title}</b> permanently?</p>

            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 border rounded" onClick={() => { setDeleteConfirmOpen(false); setEventToDelete(null); }}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={submitDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
