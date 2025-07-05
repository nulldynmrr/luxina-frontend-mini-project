"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/page";
import Sidebar from "@/components/Sidebar/page";
import { SearchProvider } from "@/context/Context";

export default function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const widthSidebar = isCollapsed ? "5rem" : "16rem";
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  // responsive
  const [sidebarMargin, setSidebarMargin] = useState("0px");
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarMargin(widthSidebar);
        setIsMobileSidebarOpen(false);
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
      <div className="flex min-h-screen">
        <div
          className="hidden md:block fixed mt-4 z-50 transition-all duration-300 ease-in-out"
          style={{ width: widthSidebar }}
        >
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        <div
          className={`mt-4 md:hidden fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50 ${
            isMobileSidebarOpen
              ? "bg-opacity-50 opacity-100"
              : "bg-opacity-0 opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              isCollapsed={true}
              toggleSidebar={toggleMobileSidebar}
              isMobile={true}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>

        <div
          className="flex-1 flex flex-col relative transition-all duration-300 ease-in-out"
          style={{ marginLeft: sidebarMargin }}
        >
          <div className="sticky top-0 z-40">
            <div className="flex justify-center md:justify-start px-2 md:px-6 py-4 bg-gradient-to-b from-[#212121] to-transparent transition-all duration-300">
              <Navbar
                onHamburgerClick={toggleMobileSidebar}
                isMobileSidebarOpen={isMobileSidebarOpen}
              />
            </div>
          </div>
          <main className="flex-1 px-2 md:px-6 py-4 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
