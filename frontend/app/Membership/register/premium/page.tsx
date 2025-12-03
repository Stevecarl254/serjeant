"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const plan = params?.plan || "standard"; // fallback

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/members/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, packageType: plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => router.push("/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] px-6">
      {!success ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#002366] mb-4 text-center">
            Join {plan.charAt(0).toUpperCase() + plan.slice(1)} Membership
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e9210]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9e9210] text-white py-3 rounded-lg shadow-md hover:bg-[#7e7411] transition font-semibold"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#002366] mb-4">
            Congratulations, you're our newest member!
          </h2>
          <p className="mb-6 text-gray-700">
            Thank you for joining the {plan.charAt(0).toUpperCase() + plan.slice(1)} Membership. Please pay via Mpesa using paybill XXX to activate your benefits.
          </p>
          <button
            onClick={handleBackHome}
            className="w-full bg-gray-600 text-white py-3 rounded-lg shadow-md hover:bg-gray-700 transition font-semibold"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
