import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import Sidebar from "@/components/Sidebar/sidebar";
import { BellIcon, UserCircleIcon, MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const AdminLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />

      <div className={`flex-1 transition-all duration-300 ${!isMobile && sidebarOpen ? "md:ml-64" : ""}`}>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-4 py-3">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MenuIcon className="h-6 w-6 text-gray-700" />
              </button>
            )}
            <BellIcon className="h-6 w-6 text-gray-600" />
          </div>

          {user ? (
            <span className="text-gray-700 font-medium">{user.username}</span>
          ) : (
            <UserCircleIcon className="h-6 w-6 text-gray-600" />
          )}
        </header>

        <main className="py-6 px-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
