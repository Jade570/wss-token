"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // App Router용 useRouter
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSocket } from "../socketContext"; // 경로는 실제 파일 위치에 맞게 수정

import vertexShader from "../shaders/sample.vert";
import fragmentShader3 from "../shaders/sample3.frag";

// 색상 정보 객체 (hue 값)
const colors = {
  queer: 0,
  stella: 32,
  sewol: 60,
  osong: 110,
  aricell: 194,
  itaewon: 265,
};

// 모델 파일 경로 배열과 이미지 버튼 경로 배열
const models = ["/planet.glb", "/star.glb", "/heart.glb"];
const modelImages = ["/planet.png", "/star.png", "/heart.png"];

function Star({ path, hue }) {
  const gltf = useGLTF(path);
  const { camera } = useThree();

  React.useEffect(() => {
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
      if (child.isMesh && child.material.uniforms?.u_time) {
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
  const router = useRouter();
  const socket = useSocket();

  // 페이지 방문 시 랜덤 초기화
  const [modelIndex, setModelIndex] = useState(() => Math.floor(Math.random() * models.length));
  const [colorKey, setColorKey] = useState(() => {
    const keys = Object.keys(colors);
    return keys[Math.floor(Math.random() * keys.length)];
  });

  const handleModelChange = (index) => {
    setModelIndex(index);
    if (socket) {
      socket.emit("modelUpdate", { id: socket.id, model: index });
    }
  };

  const handleColorChange = (key) => {
    setColorKey(key);
    if (socket) {
      socket.emit("colorUpdate", { id: socket.id, color: key });
    }
  };

  const handleEnterClick = () => {
    console.log("Enter! 버튼 클릭");
    if (socket) {
      socket.emit("modelUpdate", { id: socket.id, model: modelIndex });
      socket.emit("colorUpdate", { id: socket.id, color: colorKey });
      socket.emit("enteredUpdate", { id: socket.id, entered: 1 });
    }
    // 선택된 색상 키에 따라 라우터 이동 (예: "/stella", "/sewol", ...)
    router.push(`/${colorKey}`);
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
            onClick={() => handleModelChange(idx)}
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
            <img src={src} alt={`model-${idx}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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
            onClick={() => handleColorChange(key)}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: `hsl(${colors[key]}, 100%, 50%)`,
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
      <Canvas style={{ width: "100vw", height: "100vh", background: "transparent" }} camera={{ position: [0, 0, 25], fov: 45 }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <group position={[0, 3, 0]}>
          <Star path={models[modelIndex]} hue={colors[colorKey]} />
        </group>
        <group position={[0, -2, 0]}>
          <Stick />
        </group>
      </Canvas>
    </>
  );
}