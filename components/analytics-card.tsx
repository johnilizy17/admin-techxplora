"use client";

import {
  IconUsers,
  IconBook,
  IconUser,
  IconUserCog,
  IconTrophy,
  IconUsersGroup,
  IconBrain,
} from "@tabler/icons-react";

export default function AnalyticsCard() {
  const stats = [
    {
      title: "Total Users",
      value: 1280,
      icon: <IconUsers className="w-8 h-8 text-blue-500" />,
      color: "border-blue-500/30 hover:border-blue-500/50",
    },
    {
      title: "Total Students",
      value: 830,
      icon: <IconBook className="w-8 h-8 text-green-500" />,
      color: "border-green-500/30 hover:border-green-500/50",
    },
    {
      title: "Total Teachers",
      value: 240,
      icon: <IconUser className="w-8 h-8 text-orange-500" />,
      color: "border-orange-500/30 hover:border-orange-500/50",
    },
    {
      title: "Teacher Admins",
      value: 45,
      icon: <IconUserCog className="w-8 h-8 text-purple-500" />,
      color: "border-purple-500/30 hover:border-purple-500/50",
    },
    {
      title: "Total XP",
      value: "52,430",
      icon: <IconTrophy className="w-8 h-8 text-yellow-500" />,
      color: "border-yellow-500/30 hover:border-yellow-500/50",
    },
    {
      title: "Total Groups",
      value: 68,
      icon: <IconUsersGroup className="w-8 h-8 text-cyan-500" />,
      color: "border-cyan-500/30 hover:border-cyan-500/50",
    },
    {
      title: "Total Quiz",
      value: 312,
      icon: <IconBrain className="w-8 h-8 text-pink-500" />,
      color: "border-pink-500/30 hover:border-pink-500/50",
    },
  ];

  return (
    <main className="p-6 flex flex-col gap-8 w-full">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Analytics Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of users, XP, and performance metrics.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
