"use client";

import { useState } from "react";

export default function SettingsCards() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="w-full px-4 lg:px-8 py-6">
      <h2 className="text-2xl font-semibold mb-6">Admin Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="card bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 transition-all duration-200 hover:shadow-lg">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
            Profile Settings
          </h3>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Admin"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#CEA546] outline-none bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#CEA546] outline-none bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#CEA546] outline-none bg-transparent"
              />
            </div>
          </form>
        </div>

        {/* System Preferences */}
        <div className="card bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 transition-all duration-200 hover:shadow-lg">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
            System Preferences
          </h3>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="w-5 h-5 accent-[#CEA546] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="w-5 h-5 accent-[#CEA546] cursor-pointer"
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="card bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 transition-all duration-200 hover:shadow-lg">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
            Security Settings
          </h3>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-700 dark:text-gray-300">Enable 2FA</span>
            <input
              type="checkbox"
              checked={twoFA}
              onChange={() => setTwoFA(!twoFA)}
              className="w-5 h-5 accent-[#CEA546] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700 dark:text-gray-300">Login Alerts</span>
            <input
              type="checkbox"
              className="w-5 h-5 accent-[#CEA546] cursor-pointer"
            />
          </div>
        </div>

        {/* Save Changes */}
        <div className="card bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
            Save Your Changes
          </h3>
          <button
            className="bg-[#CEA546] hover:bg-[#b9903d] text-white font-medium px-6 py-2 rounded-xl shadow transition-all duration-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
