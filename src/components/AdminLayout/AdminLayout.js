import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import Sidebar from "@/components/Sidebar/sidebar";
import { BellIcon, UserCircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import BASE_URL from "@/components/config/apiConfig";

const AdminLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean);
    if (path.length === 0) return "Dashboard";
    return (
      path[path.length - 1].charAt(0).toUpperCase() +
      path[path.length - 1].slice(1)
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-4 py-3">
           <div className="flex items-center space-x-4">
            <BellIcon className="h-6 w-6 text-gray-600" />
            {/* Display user information */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">
                  {user.username}
                </span>
              </div>
            ) : (
              <UserCircleIcon className="h-6 w-6 text-gray-600" />
            )}
          </div>
        </header>

        <main className="py-6 px-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
