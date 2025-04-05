"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { io } from "socket.io-client";

import vertexShader from "../shaders/sample.vert";
import fragmentShader3 from "../shaders/sample3.frag";

// 색상 정보 객체 (hue 값)
const colors = {
  osong: 110,
  sewol: 60,
  stella: 32,
  itaewon: 265,
  aricell: 194,
};

// Star 컴포넌트: path와 선택된 hue 값을 prop으로 받아 적용합니다.
function Star({ path, hue }) {
  const gltf = useGLTF(path);
  const { camera } = useThree();

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader: fragmentShader3,
          uniforms: {
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_time: { value: 0 },
            u_flowerFade: { value: 0.0 },
            u_ambientLightColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
            u_directionalLightColor: { value: new THREE.Color(1, 1, 1) },
            u_directionalLightDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
            u_cameraPosition: { value: camera.position.clone() },
            u_color: { value: hue },
          },
        });
      }
    });
  }, [gltf, camera, hue]);

  useFrame(({ clock }) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material.uniforms && child.material.uniforms.u_time) {
        child.material.uniforms.u_time.value = clock.getElapsedTime();
        child.material.uniforms.u_cameraPosition.value.copy(camera.position);
      }
    });
  });

  return <primitive object={gltf.scene} />;
}

function Stick() {
  const gltf = useGLTF("/stick.glb");
  return <primitive object={gltf.scene} />;
}

export default function Scene() {
  // 모델 배열: planet, star, heart
  const models = ["/planet.glb", "/star.glb", "/heart.glb"];
  const [modelIndex, setModelIndex] = useState(0);
  // 선택된 색상 키 (colors 객체의 key)
  const [colorKey, setColorKey] = useState("aricell");

  // Socket.IO 클라이언트 연결
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://45.32.211.174", {
      path: "/socket.io",
      transports: ["websocket"],
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("웹소켓 연결 성공", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("웹소켓 연결 종료");
    });
    socket.on("playerModel", (data) => {
      console.log("서버에서 playerModel 업데이트:", data);
    });
    socket.on("playerShader", (data) => {
      console.log("서버에서 playerShader 업데이트:", data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // 모델 선택 함수
  const handleModelChange = (index) => {
    setModelIndex(index);
    if (socketRef.current) {
      socketRef.current.emit("modelUpdate", { id: socketRef.current.id, model: index });
    }
  };

  // 색상 선택 함수 (colors 객체의 key 사용)
  const handleColorChange = (key) => {
    setColorKey(key);
    if (socketRef.current) {
      socketRef.current.emit("colorUpdate", { id: socketRef.current.id, color: key });
    }
  };

  // "enter!" 버튼 클릭 시 실행할 함수 (필요에 따라 수정)
  const handleEnterClick = () => {
    console.log("enter! 버튼 클릭");
    // 추가 동작 구현 가능
  };

  return (
    <>
      {/* 모델 선택 버튼 */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={() => handleModelChange(0)} style={{ padding: "10px 20px" }}>
          Planet
        </button>
        <button onClick={() => handleModelChange(1)} style={{ padding: "10px 20px" }}>
          Star
        </button>
        <button onClick={() => handleModelChange(2)} style={{ padding: "10px 20px" }}>
          Heart
        </button>
      </div>
      {/* 색상 선택 버튼 (버튼 내부 텍스트 없음, 버튼 배경색은 H, S, B 값 적용) */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          top: "70px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        {Object.keys(colors).map((key) => (
          <button
            key={key}
            onClick={() => handleColorChange(key)}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: `hsl(${colors[key]}, 100%, 50%)`,
              border: "none",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
      {/* 뷰포트 하단 중앙의 "enter!" 텍스트 버튼 */}
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
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#777",
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
        <group position={[0, 2, 0]}>
          <Star path={models[modelIndex]} hue={colors[colorKey]} />
        </group>
        <group position={[0, -3, 0]}>
          <Stick />
        </group>
      </Canvas>
    </>
  );
}
