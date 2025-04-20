"use client";

import React, { useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/socketContext";
import Wand from "@/components/wand";
import styles from './styles.module.css';

const MODEL_ICONS = {
  planet: '/planet.png',
  star: '/star.png',
  heart: '/heart.png'
};

export default function InitToken() {
  const router = useRouter();
  const socket = useSocket();
  const [selectedModel, setSelectedModel] = useState(0);

  const handleModelSelect = (modelType) => {
    const modelIndex = Object.keys(MODEL_ICONS).indexOf(modelType);
    setSelectedModel(modelIndex);
    if (socket?.id) {
      socket.emit("modelUpdate", { id: socket.id, model: modelIndex });
    }
  };

  const handleEnterClick = () => {
    if (socket?.id) {
      socket.emit("modelUpdate", { id: socket.id, model: selectedModel });
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modelSelectContainer}>
        {Object.entries(MODEL_ICONS).map(([type, iconPath]) => (
          <button
            key={type}
            onClick={() => handleModelSelect(type)}
            className={`${styles.modelButton} ${selectedModel === Object.keys(MODEL_ICONS).indexOf(type) ? styles.selected : ''}`}
          >
            <img
              src={iconPath}
              alt={`${type} wand`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </button>
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        style={{ background: "#000000" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <group rotation={[0, Math.PI / 2, 0]}>
          <Wand modelIndex={selectedModel} />
        </group>
        <OrbitControls
          autoRotate
          autoRotateSpeed={4}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>

      <button
        className={styles.enterButton}
        onClick={handleEnterClick}
      >
        Enter magical space
      </button>
    </div>
  );
}