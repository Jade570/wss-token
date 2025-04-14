"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// 초기 카메라 위치 설정 컴포넌트
export default function InitialCameraPosition({ myPlayer }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (myPlayer) {
      camera.position.x = myPlayer.x;
      camera.position.y = myPlayer.y;
    }
  }, [myPlayer, camera]);

  return null;
}