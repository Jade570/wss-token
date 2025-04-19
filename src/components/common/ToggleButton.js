"use client";

import React from 'react';

// 모드 전환을 위한 토글 버튼 컴포넌트 (아카이브 <-> 스퀘어)
export default function ToggleButton({ isToggled, onToggle }) {
  return (
    <div style={{ position: "fixed", bottom: "80px", left: "10px", zIndex: 1000 }}>
      <div
        className="vertical-switch"
        onClick={onToggle}
        style={{
          backgroundColor: isToggled ? "#333" : "#fff",
          transition: "background-color 0.4s",
          width: "35px",
          height: "70px",
          cursor: "pointer",
          borderRadius: "20px",
          position: "relative",
        }}
      >
        <div className="circle circle-top" />
        <div className="circle circle-bottom" />
        <div
          className={`knob ${isToggled ? "active" : ""}`}
          style={{
            backgroundColor: isToggled ? "#fff" : "#333",
            transition: "transform 0.4s, background-color 0.4s",
            position: "absolute",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            top: 0,
            left: "50%",
            transform: isToggled
              ? "translate(-50%, 35px)"
              : "translate(-50%, 5px)",
          }}
        />
      </div>
      <style jsx>{`
        .circle {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          left: 50%;
          transform: translateX(-50%);
        }
        .circle-top {
          top: 2.5px;
          background-size: 80%;
          background-repeat: no-repeat;
          background-image: url("/magic.png");
        }
        .circle-bottom {
          bottom: 2.5px;
          background-image: url("/archive_dark.png");
        }
      `}</style>
    </div>
  );
}