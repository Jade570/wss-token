"use client";

import React from 'react';
import Wand from '@/components/wand.js';
import colors from '@/components/generalInfo.js';

// 완드 그룹 컴포넌트 - 개별 플레이어의 완드 시각화를 담당
export default function WandGroup({ player, pivotRef }) {
  const modelIndex = player.model || 0;
  const colorKey = player.color;
  const hue = colors[colorKey] || [255, 255, 255]; // Default to white if no color
  const x = player.x || 0;
  const y = player.y || 0;
  const z = player.z || 0;

  return (
    <group ref={pivotRef}>
      <group 
        position={[x, y, z]}
        rotation={[ 0,  0, 0]} // Rotate 90 degrees around Z axis (opposite direction)
      >
        <Wand modelIndex={modelIndex} hue={hue} />
      </group>
    </group>
  );
}