"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { API } from "@/api/api.config";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await API.post("/api/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center space-y-2 bg-zinc-100">
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center flex flex-col">
          <div className="w-full">
            <section className="max-w-2xl p-6 mx-auto rounded-md shadow-xl bg-white dark:bg-gray-800">
              <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-md font-bold text-gray-700 capitalize dark:text-white">
                  WELCOME TO{" "}
                  <span className="text-primaryColor font-semibold text-xl">
                    FREEMANN FIRMS
                  </span>
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6 mt-4">
                  <div>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-row mt-6 justify-center items-center mb-4">
                  <Button size='lg' variant='default' className="w-full" type="submit" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </div>
                {error && (
                  <div className="mt-2 text-red-600 text-center font-semibold">{error}</div>
                )}
                <div className="flex space-x-2 justify-center">
                  <h2 className="">Already a registered User?</h2>
                  <Link className="text-primaryColor font-semibold" href="/login">
                    Log In
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
