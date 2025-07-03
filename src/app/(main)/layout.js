"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/page";
import Sidebar from "@/components/Sidebar/page";


export default function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const widthSidebar = isCollapsed ? "5rem" : "16rem";

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  console.log("Hari");
  console.log(isCollapsed);

  return (
    <div className="flex">
      <div className="fixed mt-4 z-50 " style={{ width: widthSidebar }}>
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      <div
        className="flex-1 flex flex-col relative transition-all duration-300"
        style={{ marginLeft: widthSidebar }}
      >
        <div className="sticky top-0 z-40">
          <div className="px-6 py-3 bg-gradient-to-b from-[#212121] to-transparent">
            <Navbar />
          </div>
        </div>
        <main className="mt-4 px-6">{children}</main>
      </div>
    </div>
  );
}
