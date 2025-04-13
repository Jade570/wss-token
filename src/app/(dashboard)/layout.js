// 파일 경로: app/(dashboard)/archive/layout.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import colors from "@/components/generalInfo"; // 예: { queer: [R,G,B], stellar: [...], ... }
import Color from "color";
import { AnimatePresence, motion } from "framer-motion";
import { ToggleProvider, useToggle } from "@/components/toggleContext";

function LayoutWrapper({ children }) {
  const params = useParams();
  const { color } = params || {};
  const hue = color && colors[color] ? colors[color] : [255, 255, 255];
  const pathname = usePathname();
  const router = useRouter();
  const [toggle, setToggle] = useState(false);

  // 왼쪽 네비게이션 영역의 너비 애니메이션
  const navVariants = {
    collapsed: { width: "50px" },
    expanded: { width: "100vw" },
  };

  // 인덱스 버튼 컨테이너의 opacity 애니메이션
  const indexVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const handleToggle = () => {
    setToggle((prev) => {
      const next = !prev;
      // 토글 애니메이션 후 400ms 딜레이 후 페이지 전환
      setTimeout(() => {
        if (next) {
          router.push("/square");
        } else {
          router.push(color ? `/archive/${color}` : "/archive");
        }
      }, 400);
      return next;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: `rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`,
      }}
    >
        {/* 토글 버튼 */}
        <div style={{ position: "fixed", bottom: "20px", left: "10px", zIndex: 1000 }}>
          <div
            className="vertical-switch"
            onClick={handleToggle}
            style={{
              backgroundColor: toggle ? "#333" : "#fff",
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
              className={`knob ${toggle ? "active" : ""}`}
              style={{
                backgroundColor: toggle ? "#fff" : "#333",
                transition: "transform 0.4s, background-color 0.4s",
                position: "absolute",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                top: 0,
                left: "50%",
                transform: toggle
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
      {/* 오른쪽 메인 콘텐츠 영역 */}
      <div>
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <ToggleProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </ToggleProvider>
  );
}
