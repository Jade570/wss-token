"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
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

  // gltf.scene을 클론한 후 각 mesh에 새 ShaderMaterial 적용
  const clonedScene = React.useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader: fragmentShader3,
          uniforms: {
            u_resolution: {
              value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            u_time: { value: 0 },
            u_flowerFade: { value: 0.0 },
            u_ambientLightColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
            u_directionalLightColor: { value: new THREE.Color(1, 1, 1) },
            u_directionalLightDirection: {
              value: new THREE.Vector3(5, 5, 5).normalize(),
            },
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
  // 내 플레이어의 피벗 그룹 ref를 저장 (각 플레이어마다 피벗 그룹을 사용)
  const playerPivotRefs = useRef({});
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // 이미 연결되어 있다면 내 id를 설정
    if (socket.id) {
      console.log("Socket already connected with id:", socket.id);
      setMyId(socket.id);
    }

    socket.on("connect", () => {
      console.log("Connected with id:", socket.id);
      setMyId(socket.id);
    });

    socket.emit("getPlayers");

    const handlePlayers = (data) => {
      console.log("Players data:", data);
      setPlayers(data);
    };
    socket.on("players", handlePlayers);
    return () => {
      socket.off("players", handlePlayers);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const handleShake = (data) => {
      const { id } = data;
      console.log(`Shake event received for player ${id}`);
      if (playerPivotRefs.current[id]) {
        gsap
          .timeline()
          .to(playerPivotRefs.current[id].rotation, {
            duration: 0.2,
            x: "+=0.3",
            ease: "power1.inOut",
            yoyo: true,
            repeat: 1,
          })
          .to(playerPivotRefs.current[id].rotation, {
            duration: 0.2,
            x: "+=0.3",
            ease: "power1.inOut",
            yoyo: true,
            repeat: 1,
          });
      }
    };

    socket.on("shake", handleShake);
    return () => {
      socket.off("shake", handleShake);
    };
  }, [socket]);

  // entered === 1인 플레이어들만 필터링
  const enteredPlayers = Object.values(players).filter(
    (player) => player.entered === 1
  );

  // 내 플레이어의 피벗 그룹을 x축 기준으로 회전시키는 노딩 애니메이션 (2회)
  const nodMyObject = () => {
    console.log("Shake button clicked, myId:", myId);
    if (myId && playerPivotRefs.current[myId]) {
      gsap
        .timeline()
        .to(playerPivotRefs.current[myId].rotation, {
          duration: 0.2,
          x: "+=0.3", // 회전 각도 (라디안 단위; 필요에 따라 조정)
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        })
        .to(playerPivotRefs.current[myId].rotation, {
          duration: 0.2,
          x: "+=0.3",
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        });
      // 자신의 shake 이벤트를 서버로 전송
      socket.emit("shake", { id: myId });
    } else {
      console.log("No pivot ref found for myId");
    }
  };

  return (
    <>
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "#000" }}
        camera={{ position: [0, 0, 50], fov: 55 }}
        onClick={nodMyObject}
      >
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {enteredPlayers.map((player) => {
          const modelIndex = player.model;
          const colorKey = player.color;
          const hue = colors[colorKey] || 0;
          // 서버에서 할당한 플레이어의 위치 사용
          const x = player.x;
          const y = player.y;
          const z = player.z || 0;
          return (
            <group key={player.id} position={[x, y, z]}>
              {/* 피벗 그룹: 이 그룹의 origin(0,0,0)이 오브젝트의 아래쪽이 되도록 offset */}
              <group
                ref={(el) => {
                  if (el) {
                    playerPivotRefs.current[player.id] = el;
                    console.log(
                      `Registered pivot ref for ${player.id}:`,
                      el.position
                    );
                  }
                }}
                // 예: 오브젝트 높이가 10이라고 가정하면, 피벗 그룹을 [0, 5, 0]으로 offset하여 밑부분이 원점이 되도록 함.
                position={[0, 5, 0]}
              >
                <Star path={models[modelIndex]} hue={hue} />
                <group position={[0, -5, 0]}>
                  <Stick />
                </group>
              </group>
            </group>
          );
        })}
      </Canvas>
    </>
  );
}
