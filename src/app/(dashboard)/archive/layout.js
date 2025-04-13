// (dashboard)/archive/layout.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import colors from "../../../components/generalInfo"; // 예: { queer: [R,G,B], stellar: [...], ... }
import Color from "color";
import WandCanvas from "@/components/wandCanvas"; // 공통 캔버스 컴포넌트
import { useSocket } from "@/components/socketContext"; // 소켓 컨텍스트에서 useSocket 사용

function LayoutWrapper({ children }) {
  const params = useParams();
  const { color } = params || {};
  // URL에 color 값이 있으면 해당 색, 없으면 기본 흰색 대신 내 저장된 색(lastColor) 사용
  const [lastColor, setLastColor] = useState([255, 255, 255]);
  const hue = color && colors[color] ? colors[color] : lastColor;

  const pathname = usePathname();
  const router = useRouter();
  const [toggle, setToggle] = useState(false);

  const socket = useSocket();

  // 내 플레이어 데이터(모델 정보 포함)를 저장할 상태
  const [players, setPlayers] = useState({});
  const [myModel, setMyModel] = useState(0);

  // URL에 color 파라미터가 없을 경우, 내 아이디의 색상을 소켓에서 받아와 lastColor 업데이트
  useEffect(() => {
    if (socket && socket.id && !(color && colors[color])) {
      socket.emit("getPlayers");
      const handlePlayers = (data) => {
        setPlayers(data);
        if (data[socket.id] && data[socket.id].color) {
          // 만약 서버에서 color를 키(예:"queer")로 저장했다면,
          // 해당 키에 대응하는 colors 값을 lastColor로 저장
          const playerColorKey = data[socket.id].color;
          if (colors[playerColorKey]) {
            setLastColor(colors[playerColorKey]);
          }
        }
        if (data[socket.id] && data[socket.id].model !== undefined) {
          setMyModel(data[socket.id].model);
        }
      };
      socket.on("players", handlePlayers);
      return () => {
        socket.off("players", handlePlayers);
      };
    }
  }, [socket, color]);

  // 색상 인덱스 버튼 클릭 시 호출되는 핸들러
  const handleColorClick = (key) => {
    const newColor = colors[key]; // [R,G,B]
    setLastColor(newColor);
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
        backgroundColor: "#fff", // 배경은 항상 흰색
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
          {/* 흰색 인덱스 (홈 링크) */}
          <Link key="home" href="/archive">
            <div
              style={{
                width: pathname === "/archive" ? "35px" : "30px",
                height: pathname === "/archive" ? "60px" : "50px",
                marginLeft: "auto",
                backgroundColor: pathname === "/archive" ? "#fff" : "#ccc",
                borderTop: pathname === "/archive" ? "2px solid white" : "none",
                borderLeft:
                  pathname === "/archive" ? "2px solid white" : "none",
                borderBottom:
                  pathname === "/archive" ? "2px solid white" : "none",
                borderRight: "none",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                cursor: "pointer",
                transition: "all 0.4s ease",
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
        modelIndex={myModel} // 소켓에서 받아온 모델 데이터 사용
        hue={lastColor}
        useOrbit={true}
      />
    </div>
  );
}

export default function TragediesLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
