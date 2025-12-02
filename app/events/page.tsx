"use client";

import React, { useState } from "react";
import { FaCalendarAlt, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const EventsPage: React.FC = () => {
  const today = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("future");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // No events yet
  const events: any[] = [];

  const filteredEvents = events.filter(event => {
    const now = new Date();
    if (selectedFilter === "future" || selectedFilter === "all") return event.date >= now;
    if (selectedFilter === "past") return event.date < now;
    return true;
  }).filter(event =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(event =>
    selectedDate ? event.date.toDateString() === selectedDate.toDateString() : true
  );

  const toggleCalendar = () => {
    setCalendarOpen(!calendarOpen);
    if (filterOpen) setFilterOpen(false);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
    if (calendarOpen) setCalendarOpen(false);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setCalendarOpen(false);
  };

  return (
    <section className="w-full bg-white text-gray-900 py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">
            {selectedFilter === "past" ? "Past Events" : "Upcoming Events"}
          </h2>

          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210] w-full md:w-64"
            />

            <button
              onClick={toggleCalendar}
              className="flex items-center gap-2 px-4 py-2 bg-[#002366] text-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <FaCalendarAlt /> Calendar
            </button>

            <button
              onClick={toggleFilter}
              className="flex items-center gap-2 px-4 py-2 bg-[#9e9210] text-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <FaFilter /> Filter
            </button>
          </div>

          {/* Calendar Dropdown */}
          {calendarOpen && (
            <div className="absolute top-full right-0 mt-2 p-4 border rounded-lg shadow-lg bg-white w-full md:w-96 z-20">
              <div className="flex items-center justify-between mb-4">
                <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-200 rounded transition">
                  <FaChevronLeft />
                </button>
                <span className="font-semibold text-lg">{monthNames[currentMonth]} {currentYear}</span>
                <button onClick={goToNextMonth} className="p-2 hover:bg-gray-200 rounded transition">
                  <FaChevronRight />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center mb-2 font-semibold">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => handleDateClick(i + 1)}
                    className="p-2 rounded-lg cursor-pointer transition hover:bg-[#002366] hover:text-white"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Dropdown */}
          {filterOpen && (
            <div className="absolute top-full right-0 mt-2 p-4 border rounded-lg shadow-lg bg-white w-48 z-20 flex flex-col gap-2">
              <button
                className={`text-left px-2 py-1 rounded hover:bg-gray-200 ${selectedFilter === "all" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setSelectedFilter("all")}
              >
                All Events
              </button>
              <button
                className={`text-left px-2 py-1 rounded hover:bg-gray-200 ${selectedFilter === "future" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setSelectedFilter("future")}
              >
                Future Events
              </button>
              <button
                className={`text-left px-2 py-1 rounded hover:bg-gray-200 ${selectedFilter === "past" ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => setSelectedFilter("past")}
              >
                Past Events
              </button>
            </div>
          )}
        </div>

        {/* Events List */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="col-span-full text-center py-16 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-400 text-lg">No Events</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EventsPage;