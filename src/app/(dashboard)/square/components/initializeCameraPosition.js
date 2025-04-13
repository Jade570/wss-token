import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const InitializeCameraPosition = ({ myPlayer }) => {
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


export default InitializeCameraPosition