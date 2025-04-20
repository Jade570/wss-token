"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Color from "color";

export default function ColorNavigation({
  colors,
  pathname,
  isToggled,
  handleColorClick,
  handleModelClick,
  socket,
}) {
  const router = useRouter();
  const currentPathname = usePathname();
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedModel, setSelectedModel] = useState(0);
  const isArchivePage = currentPathname.startsWith('/archive');

  // Initialize selected color and model from server state
  useEffect(() => {
    if (socket?.id) {
      const handlePlayers = (data) => {
        if (data[socket.id]) {
          if (data[socket.id].color) {
            setSelectedColor(data[socket.id].color);
          }
          if (data[socket.id].model !== undefined) {
            setSelectedModel(data[socket.id].model);
          }
        }
      };
      
      socket.emit("getPlayers");
      socket.on("players", handlePlayers);
      socket.on("modelUpdate", (data) => {
        if (data.id === socket.id) {
          setSelectedModel(data.model);
        }
      });
      
      return () => {
        socket.off("players", handlePlayers);
        socket.off("modelUpdate");
      };
    }
  }, [socket]);

  // Local color change handler
  const handleLocalColorClick = (key) => {
    setSelectedColor(key);
    handleColorClick(key);
    // Only navigate to archive/[color] if we're in an archive page
    if (isArchivePage) {
      router.push(`/archive/${key}`);
    }
  };

  // Local model change handler
  const handleLocalModelClick = (modelIndex) => {
    setSelectedModel(modelIndex);
    const modelEvent = new CustomEvent('modelChange', { detail: modelIndex });
    window.dispatchEvent(modelEvent);
    handleModelClick(modelIndex);
  };

  return (
    <div
      style={{
        width: "50px",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: isToggled ? "#fff" : "#333",
        transition: "width 0.4s, background-color 0.4s",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        paddingTop: "10px",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexGrow: 1,
          transition: "opacity 0.4s",
        }}
      >
        {/* Color buttons */}
        {Object.keys(colors).map((key) => {
          const isSelected = selectedColor === key;
          const computedColor = isSelected
            ? `rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`
            : Color(
                `rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`
              )
                .darken(0.35)
                .desaturate(0.4)
                .rgb()
                .string();

          return (
            <div
              key={key}
              onClick={() => handleLocalColorClick(key)}
              style={{
                width: isSelected ? "35px" : "30px",
                height: isSelected ? "60px" : "50px",
                marginLeft: "auto",
                backgroundColor: computedColor,
                borderTop: isSelected ? "2px solid white" : "none",
                borderLeft: isSelected ? "2px solid white" : "none",
                borderBottom: isSelected ? "2px solid white" : "none",
                borderRight: "none",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                cursor: "pointer",
                transition: "all 0.4s ease",
              }}
            />
          );
        })}

        {/* Planet Button */}
        <div
          onClick={() => handleLocalModelClick(0)}
          style={{
            width: selectedModel === 0 ? "35px" : "30px",
            height: selectedModel === 0 ? "35px" : "30px",
            marginTop: "10px",
            marginLeft: "auto",
            backgroundColor: pathname === "/archive" ? "#fff" : "#ccc",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 20% 50%)",
            cursor: "pointer",
            transition: "all 0.4s ease",
            backgroundImage: "url('/planet_dark.png')",
            backgroundSize: "70%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "calc(100% - 2px) center",
            border: selectedModel === 0 ? "2px solid white" : "none",
          }}
        />
        {/* Star Button */}
        <div
          onClick={() => handleLocalModelClick(1)}
          style={{
            width: selectedModel === 1 ? "35px" : "30px",
            height: selectedModel === 1 ? "35px" : "30px",
            marginLeft: "auto",
            backgroundColor: pathname === "/archive" ? "#fff" : "#ccc",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 20% 50%)",
            cursor: "pointer",
            transition: "all 0.4s ease",
            backgroundImage: "url('/star_dark.png')",
            backgroundSize: "70%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "calc(100% - 2px) center",
            border: selectedModel === 1 ? "2px solid white" : "none",
          }}
        />
        {/* Heart Button */}
        <div
          onClick={() => handleLocalModelClick(2)}
          style={{
            width: selectedModel === 2 ? "35px" : "30px",
            height: selectedModel === 2 ? "35px" : "30px",
            marginLeft: "auto",
            backgroundColor: pathname === "/archive" ? "#fff" : "#ccc",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 20% 50%)",
            cursor: "pointer",
            transition: "all 0.4s ease",
            backgroundImage: "url('/heart_dark.png')",
            backgroundSize: "70%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "calc(100% - 2px) center",
            border: selectedModel === 2 ? "2px solid white" : "none",
          }}
        />
      </div>
    </div>
  );
}
