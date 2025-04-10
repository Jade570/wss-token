"use client";

import React from "react";
import { useParams } from "next/navigation";
import Data from "../data"; // Data 파일 경로를 실제 경로에 맞게 수정

// 색상 정보 객체 (이전과 동일)
const tragedies = {
  queer: 0,
  stellar: 32,
  sewol: 60,
  osong: 110,
  aricell: 194,
  itaewon: 265,
};

export default function TragedyDetail() {
  const params = useParams();
  const { color } = params; // 예: "queer", "stellar", 등
  const hue = tragedies[color] || 0;
  const fontColor = color === "sewol" || color === "osong" ? "#000" : "#fff";
  const subtitleBrightness =
    color === "sewol" || color === "osong" ? "20%" : "80%";
  const isDark = color === "sewol" || color === "osong" ? "_dark" : "";

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
        display: "flex",
        flexDirection: "column",
        color: fontColor,
      }}
    >
      {/* 고정된 제목 영역 */}
      <div style={{ padding: "40px", flexShrink: 0, flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h1 style={{ margin: 0 }}>{Data[color].title}</h1>
          <div
            style={{
              width: "40px",
              height: "80px",
              backgroundImage: `url("/ribbon${isDark}.png")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              visibility: color === "queer" ? "hidden" : "visible"
            }}
          ></div>
        </div>
        <div style={{ paddingBottom: "20px" }}>{Data[color].date}</div>
        <div
          style={{
            fontStyle: "italic",
            color: `hsl(${hue}, 80%, ${subtitleBrightness})`,
          }}
        >
          {Data[color].subtitle}
        </div>
      </div>

      {/* 본문 영역: 내용이 길어지면 스크롤되도록 */}
      <div
        style={{
          padding: "0 40px 40px 40px",
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{Data[color].text}</p>
      </div>
    </div>
  );
}
