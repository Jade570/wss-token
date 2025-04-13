"use client";

import React from "react";
import { useParams } from "next/navigation";
import colors from "../../../../components/generalInfo"; // 각 색상은 [R, G, B] 배열로 정의됨
import { motion } from "framer-motion";
import WandCanvas from "@/components/wandCanvas";

export default function TragedyDetail() {
  const params = useParams();
  const { color } = params || {};
  // color 값이 있으면 해당 색상을, 없으면 기본 흰색을 사용합니다.
  const hue = color && colors[color] ? colors[color] : [255, 255, 255];

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: "100%",
        backgroundColor: `rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`,
        display: "flex",
        flexDirection: "column",
        color: color === "yellow" ? "#000" : "#fff",
      }}
    >
      {/* 고정된 제목 영역 등 detail 페이지 내용 */}
      <div style={{ padding: "40px", flexShrink: 0 }}>
        <h1>Tragedy Detail Page</h1>
      </div>
      <div style={{ padding: "0 40px 40px 40px", overflowY: "auto", flexGrow: 1 }}>
        {/* 상세 내용 */}
        <p>여기에 상세 내용이 들어갑니다.</p>
      </div>
      {/* 공유 레이아웃 애니메이션을 위한 Wand 캔버스 */}
      {/* <WandCanvas
        layoutId="shared-wand"
        canvasStyle={{
          position: "fixed",
          right: "20px",
          bottom: "0px",
          width: "30vw",
          height: "30vh",
          zIndex: 100,
          background: "transparent",
        }}
        cameraProps={{ position: [0, 0, 25], fov: 45 }}
        modelIndex={0}
        hue={hue}
        useOrbit={true}
      /> */}
    </motion.div>
  );
}
