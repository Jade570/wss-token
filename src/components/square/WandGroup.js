"use client";

import React, { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Wand from '@/components/wand.js';
import colors from '@/components/generalInfo.js';
import { useSocket } from '@/components/socketContext';

// 완드 그룹 컴포넌트 - 개별 플레이어의 완드 시각화를 담당
export default function WandGroup({ player, pivotRef, isCurrentPlayer }) {
  const socket = useSocket();
  const { camera, raycaster, pointer } = useThree();
  const modelIndex = player.model || 0;
  const colorKey = player.color;
  const hue = colors[colorKey] || [255, 255, 255]; // Default to white if no color
  const x = player.x || 0;
  const y = player.y || 0;
  const z = player.z || 0;

  // Scale up the current player's wand
  const scale = isCurrentPlayer ? [1.2, 1.2, 1.2] : [1, 1, 1];

  const handleClick = useCallback((event) => {
    if (!isCurrentPlayer || !socket) return;

    // Get the next color and model
    const colorKeys = Object.keys(colors);
    const currentColorIndex = colorKeys.indexOf(colorKey);
    const nextColorIndex = (currentColorIndex + 1) % colorKeys.length;
    const nextColor = colorKeys[nextColorIndex];

    const nextModel = (modelIndex + 1) % 3;

    // Check if click is on the head (top) or body (bottom) of the wand
    const wandTop = new THREE.Vector3(x, y + 3, z); // Head position
    const wandBottom = new THREE.Vector3(x, y - 2, z); // Stick position
    
    // Project points to screen space
    const topScreen = wandTop.clone().project(camera);
    const bottomScreen = wandBottom.clone().project(camera);
    
    // Convert pointer from screen space to normalized device coordinates
    const clickY = (event.nativeEvent.offsetY / event.nativeEvent.target.offsetHeight) * 2 - 1;
    
    // If click is closer to top, change model; if closer to bottom, change color
    if (Math.abs(clickY - topScreen.y) < Math.abs(clickY - bottomScreen.y)) {
      // Clicked closer to head - change model
      socket.emit("modelUpdate", { id: socket.id, model: nextModel });
    } else {
      // Clicked closer to stick - change color
      socket.emit("colorUpdate", { id: socket.id, color: nextColor });
    }
  }, [isCurrentPlayer, socket, x, y, z, colorKey, modelIndex, camera]);

  return (
    <group ref={pivotRef} onClick={handleClick}>
      <group 
        position={[x, y, z]}
        rotation={[0, 0, 0]}
        scale={scale}
      >
        <Wand modelIndex={modelIndex} hue={hue} />
      </group>
    </group>
  );
}