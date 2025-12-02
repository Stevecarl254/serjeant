"use client";

import React from "react";

interface StandingOrder {
  id: number;
  title: string;
  country: string;
  year: number;
  fileUrl: string; // PDF or document link
}

const standingOrdersData: StandingOrder[] = [
  { id: 1, title: "Standing Order 2023", country: "Kenya", year: 2023, fileUrl: "/documents/kenya2023.pdf" },
  { id: 2, title: "Standing Order 2022", country: "Uganda", year: 2022, fileUrl: "/documents/uganda2022.pdf" },
  { id: 3, title: "Standing Order 2021", country: "Tanzania", year: 2021, fileUrl: "/documents/tanzania2021.pdf" },
  // ...add more documents here
];

const StandingOrdersPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#002366] mb-10 border-b-4 border-[#9e9210] w-fit mx-auto pb-2">
        Standing Orders
      </h1>

      {/* Description */}
      <p className="text-center text-gray-700 mb-10 max-w-3xl mx-auto">
        Browse standing orders from different country assemblies. You can view the documents or download them for offline reference.
      </p>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {standingOrdersData.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-[#002366]">{doc.title}</h3>
                <p className="text-gray-600 mt-1">{doc.country} - {doc.year}</p>
              </div>

              <div className="mt-4 flex space-x-2">
                {/* View Button */}
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 bg-[#002366] text-white rounded-lg font-medium hover:bg-[#9e9210] transition-colors"
                >
                  View
                </a>

                {/* Download Button */}
                <a
                  href={doc.fileUrl}
                  download
                  className="flex-1 text-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}

        {standingOrdersData.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No standing orders available.</p>
        )}
      </div>
    </div>
  );
};

export default StandingOrdersPage;
