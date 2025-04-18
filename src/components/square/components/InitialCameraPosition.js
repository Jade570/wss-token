"use client";

import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function InitialCameraPosition({ myPlayer }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!myPlayer) return;

    // Set camera position relative to player's wand
    const targetPosition = new THREE.Vector3(
      myPlayer.x,
      myPlayer.y, // Position slightly above the wand
      myPlayer.z + 50  // Position behind the wand
    );

    // Set the camera position
    camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
    
    // Make camera look at the player's wand
    const wandPosition = new THREE.Vector3(myPlayer.x, myPlayer.y, myPlayer.z);
    camera.lookAt(wandPosition);
  }, [myPlayer, camera]);

  return null;
}