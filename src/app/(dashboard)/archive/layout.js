"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// 색상 정보 객체 (hue 값)
// 기존 tragedies 인덱스들: queer, stellar, sewol, osong, aricell, itaewon
const tragedies = {
  queer: 0,
  stellar: 32,
  sewol: 60,
  osong: 110,
  aricell: 194,
  itaewon: 265,
};

export default function TragediesLayout({ children }) {
  const [toggle, setToggle] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽 Navbar 영역 - toggle일 때 width가 100vw로 확장 */}
      <div
        style={{
          width: toggle ? "100vw" : "50px",
          backgroundColor: toggle ? "#fff" : "#333",
          transition: "width 0.4s, background-color 0.4s",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          paddingTop: "10px",
          paddingBottom: "20px",
        }}
      >
        {/* 색깔 인덱스 버튼들 (toggle이면 opacity 0으로 사라짐) */}
        <div
          className={`color-indexes ${toggle ? "hidden" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flexGrow: 1,
            transition: "opacity 0.4s",
          }}
        >
          {/* 추가 인덱스: 흰색 인덱스, /archive 홈페이지 이동 */}
          <Link key="home" href="/archive">
              <div
                style={{
                  width: pathname === "/archive" ? "35px" : "30px",
                  height: pathname === "/archive" ? "60px" : "50px",
                  marginLeft: "auto",
                  backgroundColor: pathname === "/archive" ? "#fff" : "#f0f0f0",
                  borderTop: pathname === "/archive" ? "2px solid white" : "none",
                  borderLeft: pathname === "/archive" ? "2px solid white" : "none",
                  borderBottom: pathname === "/archive" ? "2px solid white" : "none",
                  borderRight: "none",
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  cursor: "pointer",
                }}
              ></div>
          </Link>

          {Object.keys(tragedies).map((key) => {
            const isSelected = pathname === `/archive/${key}`;
            return (
              <Link key={key} href={`/archive/${key}`}>
                  <div
                    style={{
                      width: isSelected ? "35px" : "30px",
                      height: isSelected ? "60px" : "50px",
                      marginLeft: "auto",
                      backgroundColor: isSelected
                        ? `hsl(${tragedies[key]}, 100%, 50%)`
                        : `hsl(${tragedies[key]}, 80%, 35%)`,
                      borderTop: isSelected ? "2px solid white" : "none",
                      borderLeft: isSelected ? "2px solid white" : "none",
                      borderBottom: isSelected ? "2px solid white" : "none",
                      borderRight: "none",
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                      cursor: "pointer",
                    }}
                  ></div>
              </Link>
            );
          })}
        </div>
        {/* 좌하단 세로 토글 스위치 */}
      </div>
      {/* 오른쪽 메인 콘텐츠 영역 (toggle이면 숨김 처리) */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          transition: "opacity 0.4s",
          opacity: toggle ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
