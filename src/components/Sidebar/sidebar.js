import React, { useState, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Layout, 
  Book, 
  Users, 
  Calendar, 
  LogOut, 
  FileText, 
  Settings,
  Award,
  UserCheck,
  Clipboard,
  BarChart2
} from 'lucide-react';
import { UserContext } from '@/context/UserContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useContext(UserContext);
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const allRoutes = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "ড্যাশবোর্ড",
      englishLabel: "Dashboard",
      route: "/admin/student-result",
    },
    {
      icon: <Layout className="w-5 h-5" />,
      label: "ফলাফল ব্যবস্থাপনা",
      englishLabel: "Result Management",
      route: "/admin/result-management",
      children: [
        { label: "ফলাফল প্রকাশ", englishLabel: "Publish Result", route: "/admin/student-result" },
      ],
    },
    // {
    //   icon: <Users className="w-5 h-5" />,
    //   label: "শিক্ষার্থী ব্যবস্থাপনা",
    //   englishLabel: "Student Management",
    //   route: "/admin/student-management",
    //   children: [
    //     { label: "শিক্ষার্থী তালিকা", englishLabel: "Student List", route: "/admin/student-list" },
    //     { label: "শিক্ষার্থী ভর্তি", englishLabel: "Student Admission", route: "/admin/student-admission" },
    //   ],
    // },
    // {
    //   icon: <UserCheck className="w-5 h-5" />,
    //   label: "উপস্থিতি ব্যবস্থাপনা",
    //   englishLabel: "Attendance Management",
    //   route: "/admin/attendance-management",
    //   children: [
    //     { label: "উপস্থিতি নিন", englishLabel: "Take Attendance", route: "/admin/take-attendance" },
    //     { label: "উপস্থিতি প্রতিবেদন", englishLabel: "Attendance Report", route: "/admin/attendance-report" },
    //   ],
    // },
    // {
    //   icon: <Award className="w-5 h-5" />,
    //   label: "পরীক্ষা ব্যবস্থাপনা",
    //   englishLabel: "Exam Management",
    //   route: "/admin/exam-management",
    //   children: [
    //     { label: "পরীক্ষার সময়সূচি", englishLabel: "Exam Schedule", route: "/admin/exam-schedule" },
    //     { label: "পরীক্ষার ফলাফল", englishLabel: "Exam Results", route: "/admin/student-result" },
    //   ],
    // },
    // {
    //   icon: <FileText className="w-5 h-5" />,
    //   label: "প্রতিবেদন",
    //   englishLabel: "Reports",
    //   route: "/admin/reports",
    //   children: [
    //     { label: "শ্রেণি প্রতিবেদন", englishLabel: "Class Reports", route: "/admin/class-reports" },
    //     { label: "সামগ্রিক প্রতিবেদন", englishLabel: "Summary Reports", route: "/admin/summary-reports" },
    //   ],
    // },
    // {
    //   icon: <Settings className="w-5 h-5" />,
    //   label: "সেটিংস",
    //   englishLabel: "Settings",
    //   route: "/admin/settings",
    // },
  ];

  // Filter routes based on user role
  const filteredRoutes = allRoutes.filter(route => {
    if (!user) return false;
    if (user.role === 'headmaster' || user.role === 'principal') {
      return true; // Show all routes for the headmaster/principal
    }
    if (user.role === 'teacher') {
      // Show only attendance and result-related routes for teacher
      return route.englishLabel === "Attendance Management" || 
             route.englishLabel === "Result Management" ||
             route.englishLabel === "Dashboard";
    }
    return false;
  });

  // Toggle menu open/close
  const toggleSubmenu = (route) => {
    setOpenMenus((prev) => ({
      ...prev,
      [route]: !prev[route],
    }));
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      style={{ background: "linear-gradient(to bottom, #006a4e, #004d40)" }} // Bangladesh flag green colors
    >
      <div className="w-64 h-full flex flex-col">
        {/* Government Logo and Title */}
        <div className="flex flex-col items-center justify-center px-4 py-4 border-b border-emerald-700">
        
          <h1 className="text-lg font-bold text-white text-center">বাংলাদেশ সরকারি স্কুল</h1>
          <p className="text-xs text-emerald-200 text-center">শিক্ষা মন্ত্রণালয়</p>
          <p className="text-xs text-emerald-200 text-center">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
        </div>

        {/* Admin Panel Label */}
        <div className="bg-emerald-800 text-white text-center py-2 text-sm font-medium">
          <p>এডমিন প্যানেল</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-emerald-900">
          {filteredRoutes.map((item, index) => (
            <div key={index} className="mb-1">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.route)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md
                      ${openMenus[item.route]
                        ? "bg-emerald-800 text-white"
                        : "text-white hover:bg-emerald-700"
                      }`}
                  >
                    <div className="flex items-center min-w-0">
                      <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                      <span className="ml-3 truncate">{item.label}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 
                        ${openMenus[item.route] ? "rotate-180" : "rotate-0"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openMenus[item.route] && (
                    <div className="mt-1 pl-4">
                      {item.children.map((child, childIdx) => (
                        <Link
                          key={childIdx}
                          href={child.route}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200
                            ${pathname === child.route
                              ? "bg-emerald-900 text-white font-medium border-r-4 border-yellow-400"
                              : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.route}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${pathname === item.route
                      ? "bg-emerald-900 text-white border-r-4 border-yellow-400"
                      : "text-white hover:bg-emerald-700 hover:text-white"
                    }`}
                >
                  <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                  <span className="ml-3">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        {user && (
          <div className="px-4 py-2 bg-emerald-900">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-800" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.name || user.username}</p>
                <p className="text-xs text-emerald-200">
                  {user.role === 'headmaster' ? 'প্রধান শিক্ষক' : 
                   user.role === 'teacher' ? 'শিক্ষক' : 
                   user.role === 'principal' ? 'অধ্যক্ষ' : 'এডমিন'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="px-4 py-3">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            লগ আউট
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;