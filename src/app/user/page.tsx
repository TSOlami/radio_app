"use client";

import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function UserDashboard() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <button onClick={logout} className="btn-outline">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome, {user?.firstName || user?.email}!
            </h2>
            <p className="text-gray-600 mb-6">
              This is your user dashboard. More features coming soon.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-hover">
                <h3 className="text-lg font-medium text-gray-900">Investments</h3>
                <p className="text-gray-600">Manage your portfolio</p>
              </div>
              <div className="card-hover">
                <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
                <p className="text-gray-600">View transaction history</p>
              </div>
              <div className="card-hover">
                <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                <p className="text-gray-600">Update your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}