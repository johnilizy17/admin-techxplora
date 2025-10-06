"use client";

import { IconUsersGroup, IconUserCheck, IconUserX } from "@tabler/icons-react";

export default function GroupsCard() {
  const groupStats = [
    {
      title: "Total Groups",
      value: 68,
      icon: <IconUsersGroup className="w-8 h-8 text-blue-500" />,
      color: "border-blue-500/30 hover:border-blue-500/50",
    },
    {
      title: "Active Groups",
      value: 54,
      icon: <IconUserCheck className="w-8 h-8 text-green-500" />,
      color: "border-green-500/30 hover:border-green-500/50",
    },
    {
      title: "Inactive Groups",
      value: 14,
      icon: <IconUserX className="w-8 h-8 text-red-500" />,
      color: "border-red-500/30 hover:border-red-500/50",
    },
  ];

  return (
    <main className="p-6 flex flex-col gap-8 w-full">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Group Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of all groups, including active and inactive statuses.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupStats.map((stat) => (
          <div
            key={stat.title}
            className={`border ${stat.color} bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </h2>
              {stat.icon}
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
