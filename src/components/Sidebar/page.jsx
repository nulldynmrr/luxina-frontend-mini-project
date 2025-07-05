"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiHeart, FiFilm, FiUser, FiX } from "react-icons/fi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile = false, onClose }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <FiHome size={18} /> },
    {
      name: "My Watchlist",
      href: "/my-watchlist",
      icon: <FiHeart size={18} />,
    },
    { name: "My Ticket", href: "/my-ticket", icon: <FiFilm size={18} /> },
  ];

  const profileItem = {
    name: "Profile",
    href: "/profile",
    icon: <FiUser size={18} />,
  };

  const onClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`${
        isMobile ? "w-20 h-screen" : isCollapsed ? "w-20" : "w-64"
      } h-screen bg-[#2B2B2B] text-[#D1DCE5] flex flex-col justify-between rounded-xl p-4 m-3 transition-all duration-300 ease-in-out relative`}
    >
      <div>
        <div className="mb-8 flex items-center justify-between relative">
          <div
            className={`${
              isCollapsed || isMobile
                ? "flex justify-center w-full"
                : "flex items-center justify-center gap-2"
            } transition-all duration-300`}
          >
            <Image
              src={
                isCollapsed || isMobile
                  ? "/img/logo luxina pesergi.svg"
                  : "/img/logo luxina.svg"
              }
              alt="Luxina Logo"
              width={isCollapsed || isMobile ? 40 : 120}
              height={40}
              className={`${
                isCollapsed || isMobile ? "mr-4" : "mr-0"
              } transition-all duration-300`}
            />
          </div>

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={`text-gray-300 hover:text-white mt-1 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110 ${
                isCollapsed ? "absolute top-0 right-0" : ""
              }`}
            >
              {isCollapsed ? (
                <FaAngleRight size={20} />
              ) : (
                <FaAngleLeft size={20} />
              )}
            </button>
          )}
        </div>

        <nav className="space-y-2 text-sm">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClick}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 ${
                isCollapsed || isMobile ? "justify-center" : ""
              } ${
                pathname.startsWith(item.href)
                  ? "bg-[#351C4D]"
                  : "hover:bg-[#303030]"
              }`}
            >
              <span className="transition-all duration-200">{item.icon}</span>
              {!isCollapsed && !isMobile && (
                <span className="transition-all duration-300">{item.name}</span>
              )}
            </Link>
          ))}

          <hr className="my-6 border-gray-600 transition-all duration-300" />

          <Link
            href={profileItem.href}
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 ${
              isCollapsed || isMobile ? "justify-center" : ""
            } ${
              pathname.startsWith(profileItem.href)
                ? "bg-[#351C4D]"
                : "hover:bg-[#303030]"
            }`}
          >
            <span className="transition-all duration-200">
              {profileItem.icon}
            </span>
            {!isCollapsed && !isMobile && (
              <span className="transition-all duration-300">
                {profileItem.name}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
