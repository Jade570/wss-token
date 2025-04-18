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
          // When going back to archive, use the current color or default to the first color
          router.push(`/archive/${color}`);
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
      {/* Toggle button */}
      <div style={{ position: "fixed", bottom: "20px", left: "10px", zIndex: 1000 }}>
        <div
          className="vertical-switch"
          onClick={handleToggle}
          style={{
            backgroundColor: toggle ? "#333" : "#fff",
            transition: "background-color 0.4s",
            width: "35px",
            height: "70px",
            cursor: "pointer",
            borderRadius: "20px",
            position: "relative",
          }}
        >
          <div className="circle circle-top" />
          <div className="circle circle-bottom" />
          <div
            className={`knob ${toggle ? "active" : ""}`}
            style={{
              backgroundColor: toggle ? "#fff" : "#333",
              transition: "transform 0.4s, background-color 0.4s",
              position: "absolute",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              top: 0,
              left: "50%",
              transform: toggle
                ? "translate(-50%, 35px)"
                : "translate(-50%, 5px)",
            }}
          />
        </div>
        <style jsx>{`
          .circle {
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.4s;
          }
          .circle-top {
            top: 2.5px;
            background-size: 80%;
            background-repeat: no-repeat;
            background-image: url("/magic.png");
            opacity: ${toggle ? 1 : 0};
          }
          .circle-bottom {
            bottom: 2.5px;
            background-image: url("/archive_dark.png");
            opacity: ${toggle ? 0 : 1};
          }
        `}</style>
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
