"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import colors from "../../../components/generalInfo";
import WandCanvas from "@/components/wandCanvas";
import { useSocket } from "@/components/socketContext";
import ColorNavigation from "@/components/archive/ColorNavigation";

// 아카이브 레이아웃
function LayoutWrapper({ children }) {
  const params = useParams();
  const { color } = params || {};
  const [lastColor, setLastColor] = useState([255, 255, 255]);
  const pathname = usePathname();
  const router = useRouter();
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const [myModel, setMyModel] = useState(0);

  // Get current color's RGB values
  const currentHue = color && colors[color] ? colors[color] : lastColor;

  // Socket player data update
  useEffect(() => {
    if (socket && socket.id) {
      socket.emit("getPlayers");
      const handlePlayers = (data) => {
        setPlayers(data);
        if (data[socket.id]) {
          if (data[socket.id].color && colors[data[socket.id].color]) {
            setLastColor(colors[data[socket.id].color]);
          }
          if (data[socket.id].model !== undefined) {
            setMyModel(data[socket.id].model);
          }
        }
      };
      socket.on("players", handlePlayers);
      return () => socket.off("players", handlePlayers);
    }
  }, [socket]);

  // Color change handler
  const handleColorClick = (key) => {
    if (socket?.id) {
      socket.emit("colorUpdate", { id: socket.id, color: key });
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#fff" }}>
      <ColorNavigation 
        colors={colors}
        pathname={pathname}
        isToggled={false}
        handleColorClick={handleColorClick}
      />
      
      <div style={{ 
        flex: 1, 
        overflow: "auto",
        transition: "opacity 0.4s",
        opacity: 1 
      }}>
        {children}
      </div>

      <WandCanvas
        canvasStyle={{
          position: "fixed",
          right: "0px",
          bottom: "0px",
          width: "30vw",
          height: "30vh",
          zIndex: 100,
          background: "transparent",
        }}
        cameraProps={{ position: [0, 0, 25], fov: 45 }}
        modelIndex={myModel}
        hue={currentHue}
        useOrbit={true}
      />
    </div>
  );
}

export default function TragediesLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
