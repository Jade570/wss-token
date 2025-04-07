"use client";

import React, { useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSocket } from "../../../socketContext.js"; // 실제 경로에 맞게 수정
import vertexShader from "../../../shaders/sample.vert";
import fragmentShader3 from "../../../shaders/sample3.frag";

// 색상 정보 객체 (hue 값)
const colors = {
  queer: 0,
  stellar: 32,
  sewol: 60,
  osong: 110,
  aricell: 194,
  itaewon: 265,
};

// 모델 파일 경로 배열
const models = ["/planet.glb", "/star.glb", "/heart.glb"];

function Star({ path, hue }) {
  const gltf = useGLTF(path);
  const { camera } = useThree();

  // gltf.scene을 클론한 후, 각 mesh에 새 ShaderMaterial을 할당
  const clonedScene = React.useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
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
    return clone;
  }, [gltf.scene, camera.position, hue]);

  useFrame(({ clock }) => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material.uniforms?.u_time) {
        child.material.uniforms.u_time.value = clock.getElapsedTime();
        child.material.uniforms.u_cameraPosition.value.copy(camera.position);
      }
    });
  });

  return <primitive object={clonedScene} />;
}

function Stick() {
  const gltf = useGLTF("/stick.glb");
  return <primitive object={gltf.scene.clone(true)} />;
}

export default function Square() {
  const socket = useSocket();
  const [players, setPlayers] = useState({});

  useEffect(() => {
    if (!socket) return;

    // 초기 데이터 요청
    socket.emit("getPlayers");

    const handlePlayers = (data) => {
      console.log("Players data:", data);
      setPlayers(data);
    };
    socket.on("players", handlePlayers);
    return () => socket.off("players", handlePlayers);
  }, [socket]);

  // entered === 1인 플레이어들만 필터링
  const enteredPlayers = Object.values(players).filter((player) => player.entered === 1);

  return (
    <>
      <Canvas style={{ width: "100vw", height: "100vh", background: "#000" }} camera={{ position: [0, 0, 50], fov: 55 }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {/* entered === 1인 플레이어들을 렌더링 */}
        {enteredPlayers.map((player) => {
          const modelIndex = player.model; // 서버에서 설정된 model 인덱스
          const colorKey = player.color;   // 예: "queer", "stellar", 등
          const hue = colors[colorKey] || 0;
          // 서버에서 할당한 플레이어의 위치를 사용
          const x = player.x;
          const y = player.y;
          const z = player.z;
          return (
            <group key={player.id} position={[x, y, z]}>
              <Star path={models[modelIndex]} hue={hue} />
              <group position={[0, -5, 0]}>
                <Stick />
              </group>
            </group>
          );
        })}
      </Canvas>
    </>
  );
}
