"use client";

import { useEffect, useState } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";

// Example type for a message
type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
  read: boolean;
};

const CommunicationsPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Fetch messages from backend (replace with your API)
  useEffect(() => {
    // Example static data, replace with API call
    const fetchMessages: Message[] = [
      {
        id: 1,
        name: "Stephen Otwabe",
        email: "stevomaisiba1@gmail.com",
        phone: "+254796273218",
        message: "I want to join premium membership.",
        timestamp: "2025-12-03 20:45",
        read: false,
      },
      {
        id: 2,
        name: "Amanda Adeya",
        email: "amanda@example.com",
        phone: "+254700123456",
        message: "Inquiry about council membership.",
        timestamp: "2025-12-02 15:30",
        read: true,
      },
    ];

    setMessages(fetchMessages);
  }, []);

  const unreadCount = messages.filter((msg) => !msg.read).length;

  const markAsRead = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  return (
    <section className="w-full bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#002366]">Communications</h1>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-[#9e9210] w-6 h-6" />
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {unreadCount} New
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Messages List */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#002366] mb-4">All Messages</h2>

            {messages.length === 0 && (
              <p className="text-gray-500">No messages received yet.</p>
            )}

            <ul className="space-y-4">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center ${
                    !msg.read ? "bg-gray-100 border-[#9e9210]" : "border-gray-200"
                  } hover:shadow-md`}
                  onClick={() => {
                    setSelectedMessage(msg);
                    markAsRead(msg.id);
                  }}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{msg.name}</p>
                    <p className="text-gray-500 text-sm truncate w-[200px]">
                      {msg.message}
                    </p>
                  </div>
                  {!msg.read && (
                    <FaCheckCircle className="text-[#9e9210] w-5 h-5" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[70vh] overflow-y-auto">
            {selectedMessage ? (
              <div>
                <h2 className="text-xl font-semibold text-[#002366] mb-4">
                  Message from {selectedMessage.name}
                </h2>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Email:</span> {selectedMessage.email}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Phone:</span> {selectedMessage.phone}
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Sent:</span> {selectedMessage.timestamp}
                </p>
                <div className="p-4 bg-gray-100 rounded-lg mb-4">{selectedMessage.message}</div>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Message
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Select a message to view details.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationsPage;