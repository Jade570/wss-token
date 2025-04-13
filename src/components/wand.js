"use client";

import React from "react";
import {  useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import vertexShader from "./shaders/simple.vert";
import fragmentShader from "./shaders/solid_color.frag";

// 모델 파일 경로 배열
const models = ["/planet.glb", "/star.glb", "/heart.glb"];

// 마법봉 머리 부분 렌더
function Star({ path, hue }) {
  const gltf = useGLTF(path);
  const { camera } = useThree();

  // hue 배열을 THREE.Vector3로 변환 (RGB 값을 [0,1] 범위로 변환)
  const colorVector = new THREE.Vector3(
    hue[0] / 255,
    hue[1] / 255,
    hue[2] / 255
  );

  React.useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader: fragmentShader,
          uniforms: {
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_time: { value: 0 },
            u_ambientLightColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
            u_directionalLightColor: { value: new THREE.Color(1, 1, 1) },
            u_directionalLightDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
            u_color: { value: colorVector },
            u_cameraPosition: { value: camera.position.clone() },
          },
          side: THREE.DoubleSide, // 양면 렌더링 설정 추가
        });
      }
    });
  }, [gltf, camera, hue]);

  // 만약 hue가 변경될 때 업데이트가 필요하면 아래 useEffect도 같이 수정
  React.useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material.uniforms?.u_color) {
        child.material.uniforms.u_color.value = new THREE.Vector3(hue[0] / 255, hue[1] / 255, hue[2] / 255);
      }
    });
  }, [hue, gltf, camera]);

  useFrame(({ clock }) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material.uniforms?.u_time) {
        child.material.uniforms.u_time.value = clock.getElapsedTime();
        child.material.uniforms.u_cameraPosition.value.copy(camera.position);
      }
    });
  });

  return <primitive object={gltf.scene} />;
}


// 마법봉 스틱 부분 렌더
function Stick() {
  const gltf = useGLTF("/stick.glb");
  // 매 렌더마다 새 인스턴스가 아닌, 처음 한번 clone한 결과를 반환하도록 useMemo 사용
  const stickClone = React.useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  return <primitive object={stickClone} />;
}

// 마법봉 렌더링 컴포넌트
export default function Wand(props) {
  const path = models[props.modelIndex] || "/star.glb";
  const hue = props.hue;

  return (
    <>
      <group position={[0, 3, 0]}>
        <Star path={path} hue={hue} />
      </group>
      <group position={[0, -2, 0]}>
        <Stick />
      </group>
    </>
  );
}
