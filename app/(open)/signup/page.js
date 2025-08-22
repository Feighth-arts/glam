"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Client",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(form));
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-rose-light to-light-gray px-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-dark-blue mb-2">
          Join Glamease
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          Create your account and start your beauty journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-blue mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-blue mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-blue mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-blue mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
            >
              <option value="Client">Client (Default)</option>
              <option value="Provider">Provider</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-primary text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-rose-dark transition-colors shadow-md text-sm sm:text-base"
          >
            Sign Up
          </button>
        </form>

        <p className="text-xs sm:text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
