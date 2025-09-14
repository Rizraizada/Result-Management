import React, { useState, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Layout, Book, Users, Calendar, UserCheck, LogOut 
} from 'lucide-react';
import { UserContext } from '@/context/UserContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const { user, logout } = useContext(UserContext);
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const allRoutes = [
    { icon: <Home className="w-5 h-5" />, label: "ড্যাশবোর্ড", route: "/admin/headmaster" },
    {
      icon: <Layout className="w-5 h-5" />, label: "ওয়েবসাইট ব্যবস্থাপনা", route: "/admin/website-management",
      children: [
        { label: "স্লাইডার ব্যবস্থাপনা", route: "/admin/add-slider" },
        { label: "অ্যাওয়ার্ড গ্যালারি", route: "/admin/award" },
        { label: "ছবির গ্যালারি", route: "/admin/gallery" },
      ],
    },
    {
      icon: <Layout className="w-5 h-5" />, label: "ফলাফল ব্যবস্থাপনা", route: "/admin/result-management",
      children: [
        { label: "ফলাফল প্রকাশ", route: "/admin/student-result" },
        { label: "ট্যাবুলেশন শীট", route: "/admin/tabulation" },
        { label: "বিষয় কনফিগারেশন", route: "/admin/SubjectConfigList" },

      ],
    },
    {
      icon: <Book className="w-5 h-5" />, label: "একাডেমিক ব্যবস্থাপনা", route: "/admin/academic-management",
      children: [
        { label: "শ্রেণি ব্যবস্থাপনা", route: "/admin/class" },
        { label: "সেকশন ব্যবস্থাপনা", route: "/admin/section" },
        { label: "শিক্ষক বরাদ্দ", route: "/admin/teacher-sections" },
      ],
    },
    {
      icon: <Users className="w-5 h-5" />, label: "শিক্ষক ব্যবস্থাপনা", route: "/admin/teacher-management",
      children: [
        { label: "নতুন শিক্ষক যোগ করুন", route: "/admin/teacher/add-teacher" },
        { label: "শিক্ষক তালিকা", route: "/admin/teacher/teacher-list" },
      ],
    },
    {
      icon: <Users className="w-5 h-5" />, label: "ছাত্র-ছাত্রী ব্যবস্থাপনা", route: "/admin/student-management",
      children: [
        { label: "নতুন ছাত্র/ছাত্রী যোগ করুন", route: "/admin/student/add-student" },
        { label: "ছাত্র-ছাত্রী তালিকা", route: "/admin/student/student-list" },
        { label: "এক্সেল এন্ট্রি", route: "/admin/student/Excel-Entry" },
      ],
    },
    {
      icon: <Calendar className="w-5 h-5" />, label: "উপস্থিতি ব্যবস্থাপনা", route: "/admin/attendance-management",
      children: [
        { label: "উপস্থিতি গ্রহণ", route: "/admin/attendance/attendance" },
        { label: "দ্রুত উপস্থিতি", route: "/admin/attendance/quickattendence" },
      ],
    },
    {
      icon: <Calendar className="w-5 h-5" />, label: "নোটিশ ব্যবস্থাপনা", route: "/admin/notice-management",
      children: [
        { label: "নোটিশ যুক্ত করুন", route: "/admin/notice/notice" },
      ],
    },
    {
      icon: <Users className="w-5 h-5" />, label: "কমিটি", route: "/admin/committee",
      children: [
        { label: "কমিটি যুক্ত করুন", route: "/admin/committee/add-committee" },
        { label: "কমিটির তালিকা", route: "/admin/committee/committee-list" },
      ],
    }
  ];

  const filteredRoutes = allRoutes.filter(route => {
    if (!user) return false;
    if (user.role === 'headmaster' || user.role === 'principal') return true;
    if (user.role === 'teacher') {
      return (
        route.label === "ড্যাশবোর্ড" ||
        route.label === "ফলাফল ব্যবস্থাপনা" ||
        route.label === "উপস্থিতি ব্যবস্থাপনা"
      );
    }
    return false;
  });

  const toggleSubmenu = (route) => {
    setOpenMenus(prev => ({
      ...prev,
      [route]: !prev[route],
    }));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        style={{ background: "linear-gradient(to bottom, #006a4e, #004d40)" }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center justify-center px-4 py-4 border-b border-emerald-700">
            <h1 className="text-lg font-bold text-white text-center">ভরাসার বহুমুখী উচ্চ বিদ্যালয়</h1>
            <p className="text-xs text-emerald-200 text-center">শিক্ষা মন্ত্রণালয়</p>
            <p className="text-xs text-emerald-200 text-center">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-emerald-900">
            {filteredRoutes.map((item, index) => (
              <div key={index}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.route)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                        ${openMenus[item.route] ? "bg-emerald-800 text-white" : "text-white hover:bg-emerald-700"}`}
                    >
                      <div className="flex items-center">
                        <span>{item.icon}</span>
                        <span className="ml-3">{item.label}</span>
                      </div>
                      <svg className={`w-4 h-4 transition-transform ${openMenus[item.route] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openMenus[item.route] && (
                      <div className="mt-1 pl-4">
                        {item.children.map((child, i) => (
                          <Link
                            key={i}
                            href={child.route}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200
                              ${pathname === child.route ? "bg-emerald-900 text-white border-r-4 border-yellow-400" : "text-emerald-100 hover:bg-emerald-800"}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.route}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                      ${pathname === item.route ? "bg-emerald-900 text-white border-r-4 border-yellow-400" : "text-white hover:bg-emerald-700"}`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Info */}
          {user && (
            <div className="px-4 py-2 bg-emerald-900">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
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

          {/* Logout */}
          <div className="px-4 py-3">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" /> লগ আউট
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
