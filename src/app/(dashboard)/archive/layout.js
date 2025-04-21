"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import colors from "../../../components/generalInfo";
import WandCanvas from "@/components/wandCanvas";
import { useSocket } from "@/components/socketContext";
import { useToggle } from "@/components/toggleContext";

// 아카이브 레이아웃
function LayoutWrapper({ children }) {
  const params = useParams();
  const { color } = params || {};
  const [lastColor, setLastColor] = useState([255, 255, 255]);
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const [myModel, setMyModel] = useState(0);
  const { toggle: isToggled } = useToggle();

  // Get current color's RGB values
  const currentHue = color && colors[color] ? colors[color] : lastColor;

  // Handle immediate model changes from ColorNavigation
  useEffect(() => {
    const handleModelChange = (event) => {
      setMyModel(event.detail);
    };

    window.addEventListener('modelChange', handleModelChange);
    return () => window.removeEventListener('modelChange', handleModelChange);
  }, []);

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

      const handleModelUpdate = (data) => {
        if (data.id === socket.id) {
          setMyModel(data.model);
          // Also update the local players state to stay in sync
          setPlayers(prev => ({
            ...prev,
            [socket.id]: {
              ...(prev[socket.id] || {}),
              model: data.model
            }
          }));
        }
      };

      socket.on("players", handlePlayers);
      socket.on("modelUpdate", handleModelUpdate);
      
      return () => {
        socket.off("players", handlePlayers);
        socket.off("modelUpdate", handleModelUpdate);
      };
    }
  }, [socket]);

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      backgroundColor: "#333",
      position: "relative",
    }}>
      <div style={{ 
        flex: 1,
        marginLeft: "50px", // Changed from paddingLeft to marginLeft
        transition: "transform 0.4s ease-in-out, width 0.4s ease-in-out",
        transform: isToggled ? "translateX(100%)" : "translateX(0)",
        width: isToggled ? "0" : "calc(100% - 50px)", // Subtract navigation width
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          transition: "opacity 0.4s ease-in-out",
          opacity: isToggled ? 0 : 1,
        }}>
          {children}
        </div>
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
          opacity: isToggled ? 0 : 1,
          transition: "opacity 0.4s ease-in-out",
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
