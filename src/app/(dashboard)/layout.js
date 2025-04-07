// app/(dashboard)/layout.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToggleProvider, useToggle } from "../toggleContext"; // Context 사용 예시

function DashboardContent({ children }) {
  const { toggle, setToggle } = useToggle();
  const router = useRouter();

  const handleToggle = () => {
    setToggle((prev) => {
      const next = !prev;
      setTimeout(() => {
        if (next) {
          router.push("/square");
        } else {
          router.push("/archive");
        }
      }, 400);
      return next;
    });
  };

  return (
    <div>
      {/* 고정된 토글 스위치 */}
      <div style={{ position: "fixed", bottom: "20px", left: "10px", zIndex: 1000 }}>
        <div
          className="vertical-switch"
          onClick={handleToggle}
          style={{
            backgroundColor: toggle ? "#333" : "#fff",
            transition: "background-color 0.4s",
          }}
        >
          <div className="circle circle-top" />
          <div className="circle circle-bottom" />
          <div
            className={`knob ${toggle ? "active" : ""}`}
            style={{
              backgroundColor: toggle ? "#fff" : "#333",
              transition: "transform 0.4s, background-color 0.4s",
            }}
          />
        </div>
      </div>
      <main>{children}</main>
      <style jsx>{`
        .vertical-switch {
          position: relative;
          width: 35px;
          height: 70px;
          cursor: pointer;
          border-radius: 20px;
        }
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
          background-image: url("/magic.png");
        }
        .circle-bottom {
          bottom: 2.5px;
          background-image: url("/archive_dark.png");
        }
        .knob {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          top: 0;
          left: 50%;
          transform: translate(-50%, 5px);
        }
        .knob.active {
          transform: translate(-50%, 35px);
        }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <ToggleProvider>
      <DashboardContent>{children}</DashboardContent>
    </ToggleProvider>
  );
}
