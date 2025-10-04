"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiDashboard2Fill, RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { FaUsers, FaBookBookmark } from "react-icons/fa6";
import { IoMdNotifications, IoMdClose, IoMdMenu, IoMdSettings } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { MdHelpOutline, MdLogout, MdSpa, MdAttachMoney, MdSupport } from "react-icons/md";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const pathname = usePathname();

  const menuItems = [
    { icon: RiDashboard2Fill, label: "Dashboard", href: "/admin/dashboard" },
    { icon: FaUsers, label: "Users", href: "/admin/users" },
    { icon: FaBookBookmark, label: "Bookings", href: "/admin/bookings" },
    { icon: MdSpa, label: "Services", href: "/admin/services" },
    { icon: MdAttachMoney, label: "Finances", href: "/admin/finances" },
    { icon: TbReportAnalytics, label: "Reports", href: "/admin/reports" },
    { icon: MdSupport, label: "Support", href: "/admin/support" },
    { icon: IoMdSettings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <>
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-40 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <IoMdMenu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="rounded-full w-8 h-8">
                <Image
                  src="/user.png"
                  alt="Profile Picture"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {isMobileOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-45"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </>
      )}

      {/* Sidebar */}
      <nav 
        className={`
          bg-rose-primary text-white flex flex-col
          ${isMobile ? 
            `fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out w-64 ${
              isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`
            : 
            `h-screen transition-all duration-300 ease-in-out ${
              isCollapsed ? 'w-16' : 'w-64'
            }`
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-rose-600/30 flex-shrink-0">
          {isCollapsed && !isMobile ? (
            // Collapsed desktop header - center the profile pic and put button below
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full w-10 h-10">
                <Image
                  src="/user.png"
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 hover:bg-rose-600 rounded-md transition-colors"
                title="Expand sidebar"
              >
                <RiMenuUnfoldLine className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // Expanded header
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="rounded-full w-10 h-10 flex-shrink-0">
                  <Image
                    src="/user.png"
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                
                <div className="flex flex-col min-w-0">
                  <h1 className="font-bold text-sm truncate">Admin User</h1>
                  <p className="text-xs text-rose-200">Administrator</p>
                </div>
              </div>

              {isMobile ? (
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 hover:bg-rose-600 rounded-md transition-colors flex-shrink-0"
                >
                  <IoMdClose className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1.5 hover:bg-rose-600 rounded-md transition-colors flex-shrink-0"
                  title="Collapse sidebar"
                >
                  <RiMenuFoldLine className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Menu Items - Scrollable */}
        <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1 px-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm border border-white/30' 
                        : 'hover:bg-white/10 text-rose-100 hover:text-white'
                      }
                      ${isCollapsed && !isMobile ? 'justify-center' : ''}
                    `}
                  >
                    <Icon className={`flex-shrink-0 ${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    {(!isCollapsed || isMobile) && (
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && !isMobile && (
                      <span className="fixed left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section - Fixed at bottom */}
        <div className="p-3 border-t border-rose-600/30 flex-shrink-0">
          <div className="space-y-1">
            <button 
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                hover:bg-white/10 text-rose-100 hover:text-white
                ${isCollapsed && !isMobile ? 'justify-center' : ''}
              `}
              title={isCollapsed && !isMobile ? 'Help & Feedback' : ''}
            >
              <MdHelpOutline className={`flex-shrink-0 ${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {(!isCollapsed || isMobile) && (
                <span className="text-sm font-medium truncate">Help & Feedback</span>
              )}
              
              {isCollapsed && !isMobile && (
                <span className="fixed left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  Help & Feedback
                </span>
              )}
            </button>

            <button 
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                bg-white text-rose-primary hover:bg-rose-50
                ${isCollapsed && !isMobile ? 'justify-center' : ''}
              `}
              title={isCollapsed && !isMobile ? 'Log Out' : ''}
            >
              <MdLogout className={`flex-shrink-0 ${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {(!isCollapsed || isMobile) && (
                <span className="text-sm font-medium truncate">Log Out</span>
              )}
              
              {isCollapsed && !isMobile && (
                <span className="fixed left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  Log Out
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;