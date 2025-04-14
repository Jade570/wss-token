"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSocket } from "@/components/socketContext.js";
import colors from "@/components/generalInfo.js";
import styles from "./styles.module.css";
import ModelSelector from "@/components/square/ModelSelector";
import ColorSelector from "@/components/square/ColorSelector";
import AudioPlayer from "@/components/square/AudioPlayer";
import InitialCameraPosition from "./components/initializeCameraPosition";
import WandGroup from "@/components/square/WandGroup";
import useWandAnimation from "@/components/square/hooks/useWandAnimation";

export default function Square() {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const playerPivotRefs = useRef({});
  const [myId, setMyId] = useState(null);
  const controlsRef = useRef();

  // 모델과 색상 선택 상태
  const [selectedModel, setSelectedModel] = useState(0);
  const [selectedColor, setSelectedColor] = useState('queer');

  // 완드 애니메이션 훅 사용
  const { nodWand } = useWandAnimation({ socket, myId, playerPivotRefs });

  useEffect(() => {
    if (!socket) return;

    if (socket.id) {
      console.log("Socket already connected with id:", socket.id);
      setMyId(socket.id);
    }

    socket.on("connect", () => {
      console.log("Connected with id:", socket.id);
      setMyId(socket.id);
    });

    socket.emit("getPlayers");

    const handlePlayers = (data) => {
      setPlayers(data);
    };

    socket.on("players", handlePlayers);
    return () => socket.off("players", handlePlayers);
  }, [socket]);

  const enteredPlayers = Object.values(players).filter(
    (player) => player.entered === 1
  );

  // 모델 선택 핸들러
  const handleModelSelect = (modelIndex) => {
    setSelectedModel(modelIndex);
    if (socket && myId) {
      socket.emit("modelUpdate", { id: myId, model: modelIndex });
    }
  };

  // 색상 선택 핸들러
  const handleColorSelect = (colorKey) => {
    setSelectedColor(colorKey);
    if (socket && myId) {
      socket.emit("colorUpdate", { id: myId, color: colorKey });
    }
  };

  return (
    <>
      <ModelSelector onModelSelect={handleModelSelect} />
      <ColorSelector colors={colors} onColorSelect={handleColorSelect} />
      
      {players[myId] && (
        <AudioPlayer
          socket={socket}
          player={players[myId]}
          className={styles.audioPlayerContainer}
        />
      )}

      <Canvas
        className={styles.canvasContainer}
        camera={{ position: [0, 0, 50], fov: 55 }}
        onClick={nodWand}
      >
        <OrbitControls ref={controlsRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <InitialCameraPosition myPlayer={players[myId]} />
        {enteredPlayers.map((player) => (
          <WandGroup
            key={player.id}
            player={player}
            pivotRef={(el) => {
              if (el) {
                playerPivotRefs.current[player.id] = el;
              }
            }}
          />
        ))}
      </Canvas>
    </>
  );
}
