"use client";

import React from 'react';
import styles from '@/app/(dashboard)/square/styles.module.css';

// 모델 이미지 경로 배열
const modelImages = ["/planet.png", "/star.png", "/heart.png"];

// 3D 모델 선택 컴포넌트
export default function ModelSelector({ onModelSelect }) {
  return (
    <div className={styles.modelSelectContainer}>
      {modelImages.map((src, idx) => (
        <button
          key={idx}
          onClick={() => onModelSelect(idx)}
          className={styles.modelButton}
        >
          <img
            src={src}
            alt={`model-${idx}`}
            className={styles.modelImage}
          />
        </button>
      ))}
    </div>
  );
}