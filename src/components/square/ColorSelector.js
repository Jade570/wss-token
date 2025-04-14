"use client";

import React from 'react';
import styles from '@/app/(dashboard)/square/styles.module.css';

// 색상 선택 컴포넌트
export default function ColorSelector({ colors, onColorSelect }) {
  return (
    <div className={styles.colorSelectContainer}>
      {Object.keys(colors).map((key) => (
        <button
          key={key}
          onClick={() => onColorSelect(key)}
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: `rgb(${colors[key][0]}, ${colors[key][1]}, ${colors[key][2]})`,
            border: "solid #888 2px",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "border-color 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "#aaa";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#888";
          }}
        />
      ))}
    </div>
  );
}