"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/page";
import Sidebar from "@/components/Sidebar/page";
import { SearchProvider } from "@/context/Context";

export default function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const widthSidebar = isCollapsed ? "5rem" : "16rem";
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // responsive
  const [sidebarMargin, setSidebarMargin] = useState("0px");
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarMargin(widthSidebar);
      } else {
        setSidebarMargin("0px");
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [widthSidebar]);

  return (
    <SearchProvider>
      <div className="flex">
        <div
          className="hidden md:block fixed mt-4 z-50 "
          style={{ width: widthSidebar }}
        >
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>
        <div
          className="flex-1 flex flex-col relative transition-all duration-300"
          style={{ marginLeft: sidebarMargin }}
        >
          <div className="sticky top-0 z-40">
            <div className="flex justify-center md:justify-start md:pl-6 py-3 bg-gradient-to-b from-[#212121] to-transparent">
              <Navbar />
            </div>
          </div>
          <main className="mt-4 px-6">{children}</main>
        </div>
      </div>
    </SearchProvider>
  );
}
