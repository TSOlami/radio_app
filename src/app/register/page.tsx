"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            Freeman Firms
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Registration Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;re working on the registration system. Please contact support for account creation.
            </p>
            <Link href="/login" className="btn-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}