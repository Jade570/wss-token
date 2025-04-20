"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Wand from "./wand";
import { motion } from "framer-motion";

function RotatingWand({ modelIndex, hue }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5; // Adjust speed by changing multiplier
    }
  });

  return (
    <group ref={groupRef}>
      <Wand modelIndex={modelIndex} hue={hue} />
    </group>
  );
}

export default function WandCanvas({
  layoutId,
  canvasStyle = {
    position: "fixed",
    right: "20px",
    bottom: "0px",
    width: "30vw",
    height: "30vh",
    zIndex: 100,
    background: "transparent",
  },
  cameraProps = { position: [0, 0, 25], fov: 45 },
  modelIndex = 0,
  hue = [255, 255, 255],
  useOrbit = true,
  children,
}) {
  return (
    <motion.div layoutId={layoutId} style={canvasStyle}>
      <Canvas camera={cameraProps} style={{ width: "100%", height: "100%", background: "transparent" }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[0, 0, 0]} intensity={0.5} />
        <RotatingWand modelIndex={modelIndex} hue={hue} />
        {useOrbit && <OrbitControls minDistance={5} maxDistance={50} />}
        {children}
      </Canvas>
    </motion.div>
  );
}
