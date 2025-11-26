"use client";

import React, { useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

/**
 * UpcomingEvents.tsx
 *
 * - Drop into components/UpcomingEvents.tsx
 * - Uses mockEvents (change to real data when available)
 * - Calendar & filter interactions implemented
 */

type EventItem = {
  id: string;
  title: string;
  venue: string;
  dateISO: string; // ISO date: "2025-11-20"
  time?: string;
  category?: string;
  description?: string;
};

const mockEvents: EventItem[] = [
  // some sample events — update as needed
  {
    id: "e1",
    title: "County Leadership Summit",
    venue: "Nairobi Conference Hall",
    dateISO: "2025-11-20",
    time: "09:00",
    category: "Conference",
  },
  {
    id: "e2",
    title: "Community Outreach - Kiambu",
    venue: "Kiambu Town Hall",
    dateISO: "2025-11-28",
    time: "14:00",
    category: "Outreach",
  },
  {
    id: "e3",
    title: "Annual Gala - Mombasa",
    venue: "Mombasa Beach Resort",
    dateISO: "2025-12-05",
    time: "19:00",
    category: "Gala",
  },
  {
    id: "e4",
    title: "Training Workshop - Eldoret",
    venue: "Eldoret Training Centre",
    dateISO: "2025-10-10", // past (example)
    time: "10:00",
    category: "Training",
  },
];

const today = new Date();
const todayISO = today.toISOString().slice(0, 10); // yyyy-mm-dd

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function UpcomingEvents() {
  // UI state
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "future" | "past"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  // calendar month/year
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  // selected date (yyyy-mm-dd) clicked on calendar, or "" for none
  const [selectedDate, setSelectedDate] = useState<string>("");

  // ensure toggles are mutually exclusive
  const toggleCalendar = () => {
    setCalendarOpen((v) => {
      const newVal = !v;
      if (newVal) setFilterOpen(false);
      return newVal;
    });
  };
  const toggleFilter = () => {
    setFilterOpen((v) => {
      const newVal = !v;
      if (newVal) setCalendarOpen(false);
      return newVal;
    });
  };

  // month navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  // helper to get days in month
  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Precompute events keyed by date for quick lookup & dots
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    mockEvents.forEach((e) => {
      const date = e.dateISO;
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(e);
    });
    return map;
  }, []);

  // Determine whether an ISO date is past vs future
  const isPastISO = (iso: string) => iso < todayISO;
  const isFutureISO = (iso: string) => iso >= todayISO;

  // filtering logic: when selectedDate is set, use that; otherwise use selectedFilter
  const filteredEvents = useMemo(() => {
    // start from mockEvents
    let list = [...mockEvents];

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q.length) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          (e.category || "").toLowerCase().includes(q)
      );
    }

    // Date selection filter
    if (selectedDate) {
      list = list.filter((e) => e.dateISO === selectedDate);
      // still need to ensure visibility according to selectedFilter? no — date click should show events for that date irrespective of filter
      return list.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    }

    // If no selected date, apply selectedFilter behavior
    if (selectedFilter === "future" || selectedFilter === "all") {
      // both should show future events from today forward per your spec
      list = list.filter((e) => isFutureISO(e.dateISO));
    } else if (selectedFilter === "past") {
      list = list.filter((e) => isPastISO(e.dateISO));
    }

    // Finally sort ascending by date
    list.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    return list;
  }, [selectedFilter, searchQuery, selectedDate]);

  // When user clicks a date, toggle selectedDate
  const handleDateClick = (isoDate: string) => {
    if (selectedDate === isoDate) {
      // deselect
      setSelectedDate("");
    } else {
      setSelectedDate(isoDate);
      // Closes calendar? leave open (you asked that clicking a date displays events; keeping calendar open is fine)
      // If you want calendar to close on date click, uncomment next line:
      // setCalendarOpen(false);
    }
  };

  // Helper to build calendar grid cells (1..daysInMonth) and the weekday offset
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0..6 where 0 is Sun
  const blanks = Array.from({ length: firstDay }); // empty cells before day 1

  // helper to format ISO to readable
  const formatISO = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
  };

  // UI: small helper for dots
  const hasEvents = (iso: string) => eventsByDate.has(iso);

  return (
    <section className="relative w-full bg-white text-gray-900 py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
          <h2 className="text-2xl md:text-3xl font-bold">
            Upcoming Events - {monthNames[today.getMonth()]} {today.getFullYear()}
          </h2>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210] w-full md:w-64"
            />

            {/* Calendar Button */}
            <button
              onClick={toggleCalendar}
              aria-expanded={calendarOpen}
              className={`flex items-center gap-2 px-4 py-2 bg-[#002366] text-white rounded-lg shadow-md hover:shadow-lg transition`}
            >
              <FaCalendarAlt />
              <span className="hidden sm:inline">Calendar</span>
            </button>

            {/* Filter Button */}
            <button
              onClick={toggleFilter}
              aria-expanded={filterOpen}
              className={`flex items-center gap-2 px-4 py-2 bg-[#9e9210] text-white rounded-lg shadow-md hover:shadow-lg transition`}
            >
              <FaFilter />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {/* Calendar Dropdown (positioned under header, width matches small screens) */}
          {calendarOpen && (
            <div className="absolute top-full right-0 mt-2 p-4 border rounded-lg shadow-lg bg-white w-full md:w-96 z-20">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  aria-label="Previous month"
                >
                  <FaChevronLeft />
                </button>
                <span className="font-semibold text-lg">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  aria-label="Next month"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-2 text-center mb-2 text-sm font-semibold text-gray-600">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Dates grid */}
              <div className="grid grid-cols-7 gap-2 text-center">
                {/* blanks */}
                {blanks.map((_, i) => (
                  <div key={`b${i}`} className="p-2"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const month = currentMonth + 1;
                  const iso = `${currentYear}-${String(month).padStart(2, "0")}-${String(
                    day
                  ).padStart(2, "0")}`;

                  const dot = hasEvents(iso);
                  const isToday = iso === todayISO;
                  const isSelected = iso === selectedDate;

                  return (
                    <div
                      key={iso}
                      onClick={() => handleDateClick(iso)}
                      className={`relative p-2 rounded-lg cursor-pointer transition
                        ${isSelected ? "bg-[#002366] text-white" : "hover:bg-gray-100"}
                        ${isToday && !isSelected ? "border border-[#9e9210]" : ""}`}
                      title={
                        dot
                          ? `${eventsByDate.get(iso)!.length} event(s) on ${formatISO(iso)}`
                          : `${formatISO(iso)}`
                      }
                    >
                      <div className="text-sm">{day}</div>

                      {/* small dot indicator */}
                      {dot && (
                        <div
                          className={`absolute left-1/2 transform -translate-x-1/2 bottom-1 w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-white" : "bg-[#9e9210]"
                          }`}
                          aria-hidden
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Dropdown */}
          {filterOpen && (
            <div className="absolute top-full right-0 mt-2 p-4 border rounded-lg shadow-lg bg-white w-48 z-20 flex flex-col gap-2">
              <button
                className={`text-left px-2 py-1 rounded hover:bg-gray-200 ${
                  selectedFilter === "all" ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  setSelectedFilter("all");
                  // ensure calendar closed
                  setCalendarOpen(false);
                  setFilterOpen(false);
                  setSelectedDate("");
                }}
              >
                All Events (from today)
              </button>
              <button
                className={`text-left px-2 py-1 rounded hover:bg-gray-200 ${
                  selectedFilter === "future" ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  setSelectedFilter("future");
                  setCalendarOpen(false);
                  setFilterOpen(false);
                  setSelectedDate("");
                }}
              >
                Future Events
              </button>
              <button
                className={`text-left px-2 py-1 rounded hover:bg-gray-200 ${
                  selectedFilter === "past" ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  setSelectedFilter("past");
                  setCalendarOpen(false);
                  setFilterOpen(false);
                  setSelectedDate("");
                }}
              >
                Past Events
              </button>
            </div>
          )}
        </div>

        {/* Events List */}
        <div className="mt-8">
          {/* If a date is selected, show heading for that date */}
          {selectedDate ? (
            <div className="mb-4 text-sm text-gray-600">
              Showing events for <strong>{formatISO(selectedDate)}</strong>{" "}
              <button
                onClick={() => setSelectedDate("")}
                className="ml-3 underline text-[#002366]"
              >
                Clear date
              </button>
            </div>
          ) : (
            <div className="mb-4 text-sm text-gray-600">
              Showing{" "}
              <strong>
                {selectedFilter === "all" || selectedFilter === "future"
                  ? "upcoming events (from today)"
                  : "past events"}
              </strong>
            </div>
          )}

          {/* If there are no events after filtering */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 border rounded-lg border-dashed border-gray-300">
              <p className="text-gray-400 text-lg md:text-xl">No Events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((ev) => {
                const isPast = isPastISO(ev.dateISO);
                return (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-lg shadow hover:shadow-md transition bg-white border ${
                      isPast ? "opacity-80" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#002366]">
                          {ev.title}
                        </h3>
                        <p className="text-sm text-gray-600">{ev.venue}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {formatISO(ev.dateISO)}
                        </div>
                        {ev.time && <div className="text-sm text-gray-500">{ev.time}</div>}
                      </div>
                    </div>

                    {ev.description && (
                      <p className="mt-3 text-sm text-gray-700">{ev.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}