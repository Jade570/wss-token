"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { io } from "socket.io-client";

import vertexShader from "../shaders/sample.vert";
import fragmentShader1 from "../shaders/sample.frag";
import fragmentShader2 from "../shaders/sample2.frag";

// Tone.js: 간단한 Tone 재생 함수 (짧은 소리)
const playTone = (freq) => {
  Tone.start();
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(freq, "8n");
};

// Star 컴포넌트: path와 선택된 fragment shader를 prop으로 받아 적용합니다.
function Star({ path, fragShader }) {
  const gltf = useGLTF(path);
  const { camera } = useThree();

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader: fragShader,
          uniforms: {
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_time: { value: 0 },
            u_flowerFade: { value: 0.0 },
            u_ambientLightColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
            u_directionalLightColor: { value: new THREE.Color(1, 1, 1) },
            u_directionalLightDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
            u_cameraPosition: { value: camera.position.clone() },
          },
        });
      }
    });
  }, [gltf, fragShader, camera]);

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
  // shader 배열: 두 가지 fragment shader 옵션
  const shaders = [fragmentShader1, fragmentShader2];
  const [shaderIndex, setShaderIndex] = useState(0);
  // 모델별 재생 주파수 (Planet: 440Hz, Star: 550Hz, Heart: 660Hz)

  // Socket.IO 클라이언트 연결 (서버 주소를 실제 도메인 또는 IP와 포트로 변경)
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
    // 서버에서 broadcast한 이벤트를 수신 (필요 시 처리)
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

  // 모델 선택: 모델 인덱스 변경, Tone 재생, 그리고 서버에 update 전송
  const handleModelChange = (index) => {
    setModelIndex(index);
    if (socketRef.current) {
      socketRef.current.emit("modelUpdate", { id: socketRef.current.id, model: index });
    }
  };

  // Shader 선택: shader 인덱스 변경 및 서버에 update 전송
  const handleShaderChange = (index) => {
    setShaderIndex(index);
    if (socketRef.current) {
      socketRef.current.emit("shaderUpdate", { id: socketRef.current.id, shader: index });
    }
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
      {/* Shader 선택 버튼 */}
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
        <button onClick={() => handleShaderChange(0)} style={{ padding: "10px 20px" }}>
          Shader1
        </button>
        <button onClick={() => handleShaderChange(1)} style={{ padding: "10px 20px" }}>
          Shader2
        </button>
      </div>
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "transparent" }}
        camera={{ position: [0, 0, 20], fov: 45 }}
      >
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <group position={[0, 2, 0]}>
          <Star path={models[modelIndex]} fragShader={shaders[shaderIndex]} />
        </group>
        <group position={[0, -3, 0]}>
          <Stick />
        </group>
      </Canvas>
    </>
  );
}
