"use client";
import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function RecentActivityPage() {
  const [activities, setActivities] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newItems, setNewItems] = useState([]);
  const [fadingOut, setFadingOut] = useState([]);
  const limit = 20;
  const maxItems = 50;
  const containerRef = useRef();
  const loadedKeysRef = useRef(new Set());

  const loadActivities = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axiosInstance.get("/adminDashboard/recent-activity", {
        params: { type: typeFilter, limit, skip },
      });

      const addedItems = res.data.data;

      const newUniqueItems = addedItems.filter((item) => {
        const key = `${item.type}-${item.name}-${item.date}`;
        if (loadedKeysRef.current.has(key)) return false;
        loadedKeysRef.current.add(key);
        return true;
      });

      if (newUniqueItems.length > 0) {
        setNewItems(newUniqueItems.map((_, idx) => idx));

        setActivities((prev) => {
          let combined = [...prev, ...newUniqueItems];
          if (combined.length > maxItems) {
            const overflow = combined.length - maxItems;
            const removed = combined.slice(0, overflow);

            // Animate fade-out of oldest rows
            setFadingOut(removed.map((_, idx) => idx));

            // Delay removal for fade-out animation
            setTimeout(() => {
              removed.forEach((item) => {
                const key = `${item.type}-${item.name}-${item.date}`;
                loadedKeysRef.current.delete(key);
              });
              setActivities((current) => current.slice(overflow));
              setFadingOut([]);
            }, 500); // match fade-out duration
          }
          return combined;
        });

        setSkip((prev) => prev + newUniqueItems.length);

        setTimeout(() => setNewItems([]), 500);
      }
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActivities([]);
    setSkip(0);
    loadedKeysRef.current.clear();
    loadActivities();
  }, [typeFilter]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) loadActivities();
    };
    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const isFadingOut = (idx) => fadingOut.includes(idx);

  return (
    <div ref={containerRef} className="p-6 bg-gray-50 min-h-screen overflow-auto">
      <h1 className="text-3xl font-bold text-[#002366] mb-6">Recent Activity</h1>

      {/* Sticky Filter */}
      <div className="sticky top-0 z-10 bg-gray-50 py-2 mb-4">
        <input
          type="text"
          placeholder="Filter by type: Council / Member / Event"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002366]"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
      </div>

      <table className="w-full bg-white shadow-md rounded-xl overflow-hidden text-left border border-gray-200">
        <thead className="bg-[#002366]/10">
          <tr>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.length > 0 ? (
            activities.map((item, idx) => (
              <tr
                key={idx}
                className={`border-b last:border-none hover:bg-[#9e9210]/20 transition-colors
                  ${newItems.includes(idx) ? "opacity-0 animate-fadeIn" : "opacity-100"}
                  ${isFadingOut(idx) ? "animate-fadeOut opacity-0" : ""}`}
              >
                <td className="px-4 py-2 font-medium">{item.type}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 text-gray-500">{item.date?.split("T")[0]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-4 text-gray-500 text-center">
                No activities yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {loading && (
        <p className="text-center mt-4 text-gray-500 animate-pulse">Loading more...</p>
      )}
    </div>
  );
}
