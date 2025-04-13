"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Wand from "./wand";
import { motion } from "framer-motion";

// WandCanvas는 캔버스 스타일, 카메라 설정, Wand의 modelIndex와 hue를 props로 받고,
// motion.div의 layoutId를 지정하여 페이지 간 공유 애니메이션을 지원합니다.
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
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Wand modelIndex={modelIndex} hue={hue} />
        {useOrbit && <OrbitControls />}
        {children}
      </Canvas>
    </motion.div>
  );
}
