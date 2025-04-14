"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { useSocket } from "../../../socketContext.js"; // 실제 경로에 맞게 수정
import Wand from "@/components/wand.js";
import NativeAudioPlayerWithChordProgression from "./components/webaudiotest.js";

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

function InitialCameraPosition({ myPlayer }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (myPlayer && controlsRef.current) {
      // OrbitControls의 target을 내 플레이어의 위치로 설정
      controlsRef.current.target.set(myPlayer.x, myPlayer.y, myPlayer.z);
      controlsRef.current.update();
      // 만약 카메라 자체도 내 플레이어를 바라보도록 조정하고 싶다면:
      camera.position.set(myPlayer.x, myPlayer.y, 50);
      camera.lookAt(myPlayer.x, myPlayer.y, myPlayer.z);
    }
  }, [myPlayer, camera]);

  return <OrbitControls ref={controlsRef} />;
}

export default function Square() {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  // 내 플레이어의 피벗 그룹 ref를 저장 (각 플레이어마다 피벗 그룹을 사용)
  const playerPivotRefs = useRef({});
  const [myId, setMyId] = useState(null);
  const animatingRef = useRef(false);
  const controlsRef = useRef();

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
        gsap.timeline().to(playerPivotRefs.current[id].rotation, {
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
    if (animatingRef.current) {
      // 이미 애니메이션 진행 중이면 무시합니다.
      return;
    }
    if (myId && playerPivotRefs.current[myId]) {
      animatingRef.current = true; // 애니메이션 시작
      gsap
        .timeline({
          onComplete: () => {
            // 애니메이션이 모두 완료된 후에 플래그를 false로 변경
            animatingRef.current = false;
          },
        })
        .to(playerPivotRefs.current[myId].rotation, {
          duration: 0.2,
          x: "+=0.3", // 회전 각도 (라디안 단위; 필요에 따라 조정)
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1, // 첫 번째 노딩
        })
        .to(playerPivotRefs.current[myId].rotation, {
          duration: 0.2,
          x: "+=0.3", // 두 번째 노딩
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
      {players[myId] && (
        <NativeAudioPlayerWithChordProgression
          socket={socket}
          player={players[myId]}
        />
      )}
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "#000" }}
        camera={{ position: [0, 0, 50], fov: 55 }}
        onClick={nodMyObject}
      >
        <OrbitControls ref={controlsRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {/* 내 플레이어 데이터에 따라 초기 카메라 위치 설정 (한 번만 실행) */}
        <InitialCameraPosition myPlayer={players[myId]} />
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
              {/* <group
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
              </group> */}
            </group>
          );
        })}
      </Canvas>
    </>
  );
}
