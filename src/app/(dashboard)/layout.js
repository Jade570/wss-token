"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSocket } from "@/components/socketContext";
import colors from "@/components/generalInfo";
import ToggleButton from "@/components/common/ToggleButton";
import { useToggle } from "@/components/toggleContext";

function LayoutWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggle, setToggle } = useToggle();
  const socket = useSocket();
  const isSquarePage = pathname === "/square";
  const isInitTokenPage = pathname === "/initToken";
  const isArchivePage = pathname.startsWith("/archive");
  const showNavigation = (isSquarePage || isArchivePage) && !isInitTokenPage;

  // Sync toggle state with current page
  useEffect(() => {
    setToggle(isSquarePage);
  }, [isSquarePage, setToggle]);

  // Get color from pathname or default to first color
  const pathColor = pathname.split("/").pop();
  const color = colors[pathColor] ? pathColor : Object.keys(colors)[0];
  const hue = colors[color] || [0, 0, 0];

  // Toggle handler
  const handleToggle = () => {
    setToggle(prev => {
      const next = !prev;
      setTimeout(() => {
        if (next) {
          router.push("/square");
        } else {
          router.push(color ? `/archive/${color}` : "/archive");
        }
      }, 400);
      return next;
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: isSquarePage ? "#000" : `rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`,
      }}
    >
      {showNavigation && (
        <>
          <div style={{ position: "fixed", bottom: "80px", left: "10px", zIndex: 1000 }}>
            <ToggleButton isToggled={toggle} onToggle={handleToggle} />
          </div>
          <button
            onClick={() => router.push('/')}
            style={{
              position: "fixed",
              bottom: "20px",
              left: "10px",
              zIndex: 1000,
              width: "35px",
              height: "35px",
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.3s",
              backgroundImage: "url('/home.png')",
              backgroundSize: "80%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
          </button>
        </>
      )}
      <div style={{ width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
