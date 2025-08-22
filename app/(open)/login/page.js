"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  // Pre-existing admin (cannot sign up)
  const adminAccount = {
    email: "admin@glamease.com",
    password: "admin123",
    role: "Admin",
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1) Admin check
    if (form.email === adminAccount.email && form.password === adminAccount.password) {
      router.push("/admin/dashboard");
      return;
    }

    // 2) Provider/Client from signup (saved in localStorage)
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (
      savedUser &&
      form.email === savedUser.email &&
      form.password === savedUser.password
    ) {
      if (savedUser.role === "Provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-rose-light to-light-gray px-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-dark-blue mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          Log in to manage your beauty services
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-blue mb-1">Email Address</label>
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
            <label className="block text-sm font-medium text-dark-blue mb-1">Password</label>
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

          <button
            type="submit"
            className="w-full bg-rose-primary text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-rose-dark transition-colors shadow-md text-sm sm:text-base"
          >
            Log In
          </button>
        </form>

        <p className="text-xs sm:text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-rose-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
