"use client";

import React, { useState, useEffect } from "react";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  year: number;
}

const galleryData: GalleryItem[] = [
  { id: 1, title: "Event 1", image: "/gallery/event1.jpg", category: "Ceremony", year: 2023 },
  { id: 2, title: "Event 2", image: "/gallery/event2.jpg", category: "Meeting", year: 2022 },
  { id: 3, title: "Event 3", image: "/gallery/event3.jpg", category: "Ceremony", year: 2021 },
  // ...add all other images here
];

const ITEMS_PER_PAGE = 9;

// Assign colors for each category
const categoryColors: Record<string, string> = {
  Ceremony: "bg-[#9e9210]",
  Meeting: "bg-[#002366]",
  Workshop: "bg-[#00a86b]",
  Default: "bg-gray-500",
};

const GalleryPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [animate, setAnimate] = useState(false);

  const categories = ["All", "Ceremony", "Meeting", "Workshop"];
  const years = ["All", "2023", "2022", "2021"];

  const filteredGallery = galleryData.filter((item) => {
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesYear = yearFilter === "All" || item.year.toString() === yearFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesYear && matchesSearch;
  });

  const totalPages = Math.ceil(filteredGallery.length / ITEMS_PER_PAGE);
  const paginatedGallery = filteredGallery.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      scrollToTop();
      return newPage;
    });
  };

  const handleNext = () => {
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, totalPages);
      scrollToTop();
      return newPage;
    });
  };

  const handlePageClick = (page: number) => {
    scrollToTop();
    setCurrentPage(page);
  };

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [currentPage, categoryFilter, yearFilter, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Centered Styled Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#002366] mb-8 text-center relative inline-block">
        Serjeant At Arms Gallery
        <span className="block h-1 w-24 bg-[#9e9210] mx-auto mt-2 rounded-full"></span>
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6">
          <h2 className="text-xl font-bold text-[#002366]">Filters</h2>

          <div className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
            >
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
            >
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
            />
          </div>
        </div>

        {/* Right Gallery */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedGallery.length > 0 ? (
              paginatedGallery.map((item) => (
                <div
                  key={item.id}
                  className={`relative group bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform
                    ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} transition-all duration-500`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                  />

                  {/* Category Badge */}
                  <span className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold text-white rounded-full
                    ${categoryColors[item.category] || categoryColors["Default"]}`}>
                    {item.category}
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4">
                    <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-200 mt-1">{item.year}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No items found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#002366] text-white hover:bg-[#9e9210]"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageClick(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === i + 1
                      ? "bg-[#9e9210] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-[#002366] hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#002366] text-white hover:bg-[#9e9210]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;