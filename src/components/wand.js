"use client";

import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import vertexShader from "./shaders/simple.vert";
import fragmentShader from "./shaders/solid_color.frag";

const models = ["/planet.glb", "/star.glb", "/heart.glb"];

function Star({ path, hue }) {
  const gltf = useGLTF(path);
  const { camera } = useThree();
  const colorVector = new THREE.Vector3(hue[0] / 255, hue[1] / 255, hue[2] / 255);

  const clonedScene = React.useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_time: { value: 0 },
            u_ambientLightColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
            u_directionalLightColor: { value: new THREE.Color(1, 1, 1) },
            u_directionalLightDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
            u_color: { value: colorVector },
            u_cameraPosition: { value: camera.position.clone() },
          },
          side: THREE.DoubleSide,
        });
      }
    });
    return scene;
  }, [gltf.scene, camera, colorVector]);

  useFrame(({ clock }) => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material.uniforms) {
        child.material.uniforms.u_time.value = clock.getElapsedTime();
        child.material.uniforms.u_cameraPosition.value.copy(camera.position);
      }
    });
  });

  return <primitive object={clonedScene} />;
}

function Stick() {
  const gltf = useGLTF("/stick.glb");
  const stickClone = React.useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  return <primitive object={stickClone} />;
}

export default function Wand({ modelIndex = 0, hue = [255, 255, 255] }) {
  const path = models[modelIndex] || models[0];
  
  return (
    <group>
      <group position={[0, 3, 0]} scale={[1, 1, 1]}>
        <Star path={path} hue={hue} />
      </group>
      <group position={[0, -2, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
        <Stick />
      </group>
    </group>
  );
}
