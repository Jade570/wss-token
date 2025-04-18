"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Wand from "./wand";
import { motion } from "framer-motion";

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
        <group position={[0, 0, 0]} rotation={[0, 0,0]}>
          <Wand modelIndex={modelIndex} hue={hue} />
        </group>
        {useOrbit && <OrbitControls minDistance={5} maxDistance={50} />}
        {children}
      </Canvas>
    </motion.div>
  );
}
