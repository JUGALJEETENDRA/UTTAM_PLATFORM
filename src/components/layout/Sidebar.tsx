"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ role = "STUDENT", subjectId = "sub_ada" }: { role?: string, subjectId?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0] || "Faculty";
  const email = session?.user?.email || "";
  const avatar = firstName ? firstName[0].toUpperCase() : "F";

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Determine dashboard link based on role
  let dashboardHref = "/faculty/dashboard";

  const NAV_ITEMS = [
    {
      href: dashboardHref,
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 p-5 border-b border-gray-100">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md">
          <span className="text-white font-bold">ED</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-gray-900 leading-tight text-sm">ED-Tech Platform</p>
            <p className="text-xs text-gray-500">Student Portal</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-gray-400 hover:text-gray-700 transition"
          aria-label="Toggle sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
            />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className={active ? "text-red-500" : ""}>{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info / Role indicator */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex flex-col gap-2 px-3 py-2.5 rounded-xl ${collapsed ? "" : "bg-gray-50"}`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {avatar}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{firstName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition"
                aria-label="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
