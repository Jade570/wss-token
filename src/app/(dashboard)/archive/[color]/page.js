"use client";

import React from "react";
import { useParams } from "next/navigation";
import colors from "../../../../components/generalInfo"; // 각 색상은 [R, G, B] 배열로 정의됨
import { motion } from "framer-motion";
import Data from "../data";

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
        <h1>{color.toUpperCase()}</h1>
      </div>
      <div style={{ padding: "0 40px 40px 40px", overflowY: "auto", flexGrow: 1 }}>
        {/* 상세 내용 */}
        <p>여기에 상세 내용이 들어갑니다.</p>
      </div>
    </motion.div>
  );
}
