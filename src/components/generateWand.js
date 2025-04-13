"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // App Router용 useRouter
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSocket } from "./socketContext";
import colors from "./generalInfo"; // 색상 정보 가져오기
import Wand from "./wand";


// // 색상 정보 객체 (hue 값)
// const colors = {
//   queer: 0,
//   stellar: 32,
//   sewol: 60,
//   osong: 110,
//   aricell: 194,
//   itaewon: 265,
// };

// 모델 파일 경로 배열과 이미지 버튼 경로 배열
const models = ["/planet.glb", "/star.glb", "/heart.glb"];
const modelImages = ["/planet.png", "/star.png", "/heart.png"];


export default function Scene() {
  const router = useRouter();
  const socket = useSocket();

  // 페이지 방문 시 랜덤 초기화
  const [modelIndex, setModelIndex] = useState(() =>
    Math.floor(Math.random() * models.length)
  );
  const [colorKey, setColorKey] = useState(() => {
    const keys = Object.keys(colors);
    return keys[Math.floor(Math.random() * keys.length)];
  });

  const handleEnterClick = () => {
    if (socket) {
      // player id와 모델의 인덱스(0,1,2)를 서버에 전송
      // player id와 컬러의 키(queer,aricell...)를 서버에 전송
      // player id와 magical space에 entered 여부를 서버에 전송
      socket.emit("modelUpdate", { id: socket.id, model: modelIndex });
      socket.emit("colorUpdate", { id: socket.id, color: colorKey });
      socket.emit("enteredUpdate", { id: socket.id, entered: 1 });
    }
    // 페이지 이동
    router.push("/archive/");
  };

  return (
    <>
      {/* 모델 선택 이미지 버튼 */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "5px",
        }}
      >
        {modelImages.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setModelIndex(idx)}
            style={{
              width: "40px",
              height: "40px",
              padding: 0,
              border: "solid #888 2px",
              background: "#444",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <img
              src={src}
              alt={`model-${idx}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </button>
        ))}
      </div>
      {/* 색상 선택 버튼 */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          top: "65px",
          left: "20px",
          display: "flex",
          gap: "5px",
        }}
      >
        {Object.keys(colors).map((key) => (
          <button
            key={key}
            onClick={() => {setColorKey(key)
            }}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: `rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`,
              border: "solid #888 2px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
      {/* Enter! 버튼 */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button
          onClick={handleEnterClick}
          style={{
            padding: "10px 60px",
            fontSize: "16px",
            border: "solid #888 2px",
            borderRadius: "4px",
            backgroundColor: "#444",
            cursor: "pointer",
          }}
        >
          Enter!
        </button>
      </div>
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "transparent" }}
        camera={{ position: [0, 0, 25], fov: 45 }}
      >
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Wand modelIndex={modelIndex} hue={colors[colorKey]}/>
      </Canvas>
    </>
  );
}
