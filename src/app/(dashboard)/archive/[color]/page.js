"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import colors from "../../../../components/generalInfo"; // 각 색상은 [R, G, B] 배열로 정의됨
import { motion } from "framer-motion";
import Data from "../data";
import ReactMarkdown from "react-markdown";

export default function TragedyDetail() {
  const params = useParams();
  const { color } = params || {};
  // color 값이 있으면 해당 색상을, 없으면 기본 흰색을 사용합니다.
  const hue = color && colors[color] ? colors[color] : [255, 255, 255];

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" }); // 부드러운 스크롤 적용 (선택 사항)
      }
    }
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }} // 0.4초 동안 부드러운 전환
      style={{
        height: "100%",
        backgroundColor: `rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`,
        display: "flex",
        flexDirection: "column",
        color: color === "yellow" ? "#000" : "#fff",
      }}
    >
      {/* 고정된 제목 영역 등 detail 페이지 내용 */}
      <div
        style={{
          paddingTop: "20px",
          paddingLeft: "40px",
          paddingBottom: "20px",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontFamily: '"Special Gothic Expanded One", "sans-serif"',
            fontWeight: "400",
            fontStyle: "normal",
            paddingBottom: "0px",
            marginBlockEnd: "0px",
          }}
        >
          {color.toUpperCase()}
        </h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ paddingRight: "7px" }}>{Data[color].meaning}</div>
          <div style={{ paddingRight: "7px" }}>|</div>
          <div
            style={{
              fontStyle: "italic",
              color: color === "yellow" ? "#555" : "#ddd",
              paddingRight: "7px",
            }}
          >
            {Data[color].code}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "0 40px 40px 40px",
          overflowY: "auto",
          flexGrow: 1,
          textIndent: "1em",
          lineHeight: "1.5",
          fontFamily: '"PT Serif", serif',
          fontWeight: 400,
          fontStyle: "normal",
          maxWidth: "800px",
        }}
      >
        {/* 상세 내용 */}
        <ReactMarkdown>{Data[color].text}</ReactMarkdown>
        <div style={{ position: "relative", marginTop:"20px" }}>
          <hr style={{marginBottom: "1.25em"}}></hr>
          <div
            style={{
              color: color === "yellow" ? "#555" : "#ddd",
              fontFamily: '"Special Gothic Expanded One", "sans-serif"',
              fontWeight: "400",
              fontStyle: "normal",
              position: "absolute",
              top: "calc(100% + 30px)",
              fontSize: "0.6em",
              left: 0,
              paddingBottom: "1em",
              textIndent: "0px",
              borderRadius: "4px",
            }}
          >
            Tragedy in the 21st Century
          </div>
        </div>

        <h2
          style={{
            fontFamily: '"Special Gothic Expanded One", "sans-serif"',
            fontWeight: "400",
            fontStyle: "normal",
            paddingBottom: "0px",
            marginBlockStart: "0px",
            marginBlockEnd: "0px",
            textIndent: "0px",
            paddingTop: "20px",
          }}
          id="tragedy-21c"
        >
          {Data[color].tragedy.title}
        </h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              paddingRight: "7px",
              fontFamily: '"Special Gothic Expanded One", "sans-serif"',
              color: color === "yellow" ? "#555" : "#ddd",
              paddingBottom: "0px",
              marginBlockStart: "0px",
              marginBlockEnd: "0px",
              textIndent: "0px",
              fontStyle: "italic",
              lineHeight: "1.2",
            }}
          >
            {Data[color].tragedy.subtitle}
          </div>
          <div
            style={{
              fontStyle: "italic",
              color: color === "yellow" ? "#000" : "#fff",
              paddingRight: "7px",
              paddingBottom: "1.25em",
              textIndent: "0px",
            }}
          >
            {Data[color].tragedy.date}
          </div>
        </div>
        <ReactMarkdown>{Data[color].tragedy.text}</ReactMarkdown>
        <style jsx>{`
        a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s;
          border-style: dotted;
          border: none;
          border-left: 3px solid #8fd9a3;
          padding-left: 5px;
          background-color: rgb(228, 248, 232);
        }
      `}</style>
      </div>

    </motion.div>
  );
}
