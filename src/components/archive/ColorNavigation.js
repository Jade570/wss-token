"use client";

import React from 'react';
import Link from 'next/link';
import Color from 'color';

// 색상 내비게이션 사이드바 컴포넌트
export default function ColorNavigation({ colors, pathname, isToggled, handleColorClick }) {
  return (
    <div
      style={{
        width: isToggled ? "100vw" : "50px",
        backgroundColor: isToggled ? "#fff" : "#333",
        transition: "width 0.4s, background-color 0.4s",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        paddingTop: "10px",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexGrow: 1,
          transition: "opacity 0.4s",
        }}
      >
        {/* 흰색 홈 링크 */}
        <Link key="home" href="/archive">
          <div
            style={{
              width: pathname === "/archive" ? "35px" : "30px",
              height: pathname === "/archive" ? "60px" : "50px",
              marginLeft: "auto",
              backgroundColor: pathname === "/archive" ? "#fff" : "#ccc",
              borderTop: pathname === "/archive" ? "2px solid white" : "none",
              borderLeft: pathname === "/archive" ? "2px solid white" : "none",
              borderBottom: pathname === "/archive" ? "2px solid white" : "none",
              borderRight: "none",
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              cursor: "pointer",
              transition: "all 0.4s ease",
            }}
          />
        </Link>

        {/* 컬러 버튼들 */}
        {Object.keys(colors).map((key) => {
          const isSelected = pathname === `/archive/${key}`;
          const computedColor = isSelected
            ? `rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`
            : Color(`rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`)
                .darken(0.35)
                .desaturate(0.4)
                .rgb()
                .string();

          return (
            <Link key={key} href={`/archive/${key}`}>
              <div
                onClick={() => handleColorClick(key)}
                style={{
                  width: isSelected ? "35px" : "30px",
                  height: isSelected ? "60px" : "50px",
                  marginLeft: "auto",
                  backgroundColor: computedColor,
                  borderTop: isSelected ? "2px solid white" : "none",
                  borderLeft: isSelected ? "2px solid white" : "none",
                  borderBottom: isSelected ? "2px solid white" : "none",
                  borderRight: "none",
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}