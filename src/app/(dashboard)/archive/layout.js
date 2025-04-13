// (dashboard)/archive/layout.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import colors from "../../../components/generalInfo"; // 예: { queer: [R,G,B], stellar: [...], ... }
import Color from "color";
import WandCanvas from "@/components/wandCanvas"; // 공통 캔버스 컴포넌트
import { useSocket } from "@/components/socketContext"; // 소켓 컨텍스트에서 useSocket 사용

function LayoutWrapper({ children }) {
  const params = useParams();
  const { color } = params || {};
  // URL에 color 값이 있으면 해당 색, 없으면 기본 흰색([255,255,255])
  const hue = color && colors[color] ? colors[color] : [255, 255, 255];
  const pathname = usePathname();
  const router = useRouter();
  const [toggle, setToggle] = useState(false);

  const socket = useSocket();

  // 색상 인덱스 버튼 클릭 시 호출되는 핸들러
  const handleColorClick = (key) => {
    // 색상을 업데이트하는 것은 라우팅으로 처리되지만, 여기서 소켓 이벤트를 전송합니다.
    if (socket && socket.id) {
      console.log("color update,", socket.id, key);
      socket.emit("colorUpdate", { id: socket.id, color: key });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: `rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`,
      }}
    >
      {/* 왼쪽 네비게이션 */}
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
        {/* 색상 인덱스 버튼들 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flexGrow: 1,
            transition: "opacity 0.4s",
          }}
        >
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
              }}
            ></div>
          </Link>
          {Object.keys(colors).map((key) => {
            const isSelected = pathname === `/archive/${key}`;
            const computedColor = isSelected
              ? `rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`
              : Color(
                  `rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`
                )
                  .darken(0.35)
                  .desaturate(0.4)
                  .rgb()
                  .string();
            return (
              <Link key={key} href={`/archive/${key}`}>
                <div
                  // onClick를 추가하여 색상 인덱스 클릭 시 소켓 이벤트 전송
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
                  }}
                ></div>
              </Link>
            );
          })}
        </div>
      </div>
      {/* 오른쪽 메인 콘텐츠 영역 */}
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
      {/* 오른쪽 하단 Wand 캔버스 영역 */}
      <WandCanvas
        canvasStyle={{
          position: "fixed",
          right: "0px",
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
      />
    </div>
  );
}

export default function TragediesLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
