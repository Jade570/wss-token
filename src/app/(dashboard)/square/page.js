"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSocket } from "@/components/socketContext.js";
import styles from "./styles.module.css";
import AudioPlayer from "@/components/square/AudioPlayer";
import InitialCameraPosition from "@/components/square/components/InitialCameraPosition";
import WandGroup from "@/components/square/WandGroup";
import useWandAnimation from "@/components/square/hooks/useWandAnimation";

export default function Square() {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const playerPivotRefs = useRef({});
  const [myId, setMyId] = useState(null);
  const controlsRef = useRef();
  const [myPosition, setMyPosition] = useState({ x: 0, y: 0, z: 0 });

  const { nodWand } = useWandAnimation({ socket, myId, playerPivotRefs });

  useEffect(() => {
    if (!socket) return;

    if (socket.id) {
      setMyId(socket.id);
      socket.emit("enteredUpdate", { id: socket.id, entered: 1 });
      socket.emit("positionUpdate", { id: socket.id, ...myPosition });
    }

    socket.on("connect", () => {
      setMyId(socket.id);
      socket.emit("enteredUpdate", { id: socket.id, entered: 1 });
      socket.emit("positionUpdate", { id: socket.id, ...myPosition });
    });

    const handlePlayers = (data) => {
      setPlayers(data);
      if (data[socket.id] && controlsRef.current) {
        // Update OrbitControls target to player's position
        controlsRef.current.target.set(
          data[socket.id].x || 0,
          data[socket.id].y || 0,
          data[socket.id].z || 0
        );
      }
    };

    socket.emit("getPlayers");
    socket.on("players", handlePlayers);
    
    return () => {
      socket.off("players", handlePlayers);
    };
  }, [socket, myPosition]);

  const enteredPlayers = Object.values(players).filter(player => player.entered === 1);

  return (
    <>
      {players[myId] && (
        <AudioPlayer
          socket={socket}
          player={players[myId]}
          players={players}
          className={styles.audioPlayerContainer}
        />
      )}

      <Canvas
        className={styles.canvasContainer}
        camera={{ position: [0, 5, 15], fov: 75 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[0, 0, 0]} intensity={0.5} />
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          minDistance={5}
          maxDistance={50}
          target={[myPosition.x, myPosition.y, myPosition.z]}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {players[myId] && <InitialCameraPosition myPlayer={players[myId]} />}
        
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
