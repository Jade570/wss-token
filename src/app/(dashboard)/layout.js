"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSocket } from "@/components/socketContext";
import colors from "@/components/generalInfo";
import ToggleButton from "@/components/common/ToggleButton";
import { useToggle } from "@/components/toggleContext";
import HomeButton from "@/components/common/HomeButton";
import ColorNavigation from "@/components/archive/ColorNavigation";
import Home from "../page";

function LayoutWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggle, setToggle } = useToggle();
  const socket = useSocket();
  const [lastSelectedColor, setLastSelectedColor] = useState('red');
  const isSquarePage = pathname === "/square";
  const isInitTokenPage = pathname === "/initToken";
  const isArchivePage = pathname.startsWith("/archive");
  const showNavigation = (isSquarePage || isArchivePage) && !isInitTokenPage;

  // Color change handler
  const handleColorClick = (key) => {
    if (socket?.id) {
      setLastSelectedColor(key);
      socket.emit("colorUpdate", { id: socket.id, color: key });
    }
  };

  // Model change handler
  const handleModelClick = (modelNumber) => {
    if (socket?.id) {
      socket.emit("modelUpdate", { id: socket.id, model: modelNumber });
    }
  };

  // Get color from pathname or use last selected color
  const pathColor = pathname.split("/").pop();
  const color = colors[pathColor] ? pathColor : lastSelectedColor;
  const hue = colors[color] || [0, 0, 0];

  // Sync toggle state with current page
  useEffect(() => {
    setToggle(isSquarePage);
  }, [isSquarePage, setToggle]);

  // Load initial player state
  useEffect(() => {
    if (socket?.id) {
      socket.emit("getPlayers");
      const handlePlayers = (data) => {
        if (data[socket.id]?.color) {
          setLastSelectedColor(data[socket.id].color);
        }
      };
      socket.on("players", handlePlayers);
      return () => socket.off("players", handlePlayers);
    }
  }, [socket]);

  // Toggle handler
  const handleToggle = () => {
    setToggle((prev) => {
      const next = !prev;
      setTimeout(() => {
        if (next) {
          router.push("/square");
        } else {
          router.push(`/archive/${lastSelectedColor}`);
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
        backgroundColor: "#000",
        display: "flex",
      }}
    >
      <div style={{ flex: 1, height: "100%", position: "relative" }}>{children}</div>
      {showNavigation && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "50px",
            height: "100vh",
            zIndex: 2,
          }}
        >
          <ColorNavigation
            colors={colors}
            pathname={pathname}
            isToggled={toggle}
            handleColorClick={handleColorClick}
            handleModelClick={handleModelClick}
            socket={socket}
          />
          <div
            style={{
              position: "fixed",
              bottom: "80px",
              left: "10px",
              zIndex: 2,
            }}
          >
            <ToggleButton isToggled={toggle} onToggle={handleToggle} />
            <HomeButton />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
