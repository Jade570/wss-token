"use client";

import React from "react";

export default function TragediesPage() {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "start",
        background: "#fff",
        fontFamily: '"Special Gothic Expanded One", "sans-serif"',
        fontWeight: "400",
        fontStyle: "normal",
        marginBlockEnd: "0px",
      }}
    >
      <h1>Where Does Melancholy Come From, and Where Is It Heading?</h1>
      <h3
        style={{
          fontStyle: "italic",
          color: "#333",
          paddingBottom: "40px",
        }}
      >
        우울은 어디에서 와서 어디로 가는걸까?
      </h3>
      <p
        style={{
          paddingBottom: "10px",
          textIndent: "1em",
          lineHeight: "1.5",
          fontFamily: '"PT Serif", serif',
          fontWeight: 400,
          fontStyle: "normal",
          maxWidth: "800px",
        }}
      >
        Welcome to my private space of tender and shy thoughts - where sorrows,
        cherished memories, and hopes intertwine. Explore the reflections tied
        to each color and discover your own magical hue. By clicking on the
        toggle{" "}
        <img
          src="/archive_dark.png"
          alt="emoji"
          style={{
            height: "1em", // 텍스트 높이와 맞춤
            verticalAlign: "middle", // 텍스트와 수직 정렬
            margin: "0 0.2em", // 텍스트와 약간의 간격
          }}
        />
        <img
          src="/magic_dark.png"
          alt="emoji"
          style={{
            height: "1em", // 텍스트 높이와 맞춤
            verticalAlign: "middle", // 텍스트와 수직 정렬
            margin: "0 0.2em", // 텍스트와 약간의 간격
          }}
        />{" "}
        , you can step into the enchanted square or return to this personal
        haven to read more.
      </p>
      <p
        style={{
          paddingBottom: "10px",
          textIndent: "1em",
          lineHeight: "1.5",
          fontFamily: '"PT Serif", serif',
          fontWeight: 400,
          fontStyle: "normal",
          maxWidth: "800px",
        }}
      >
        The tragedies of 21st-century Korea include{" "}
        <a
          href="/archive/yellow#tragedy-21c"
          style={{
            color: "inherit",
            textDecoration: "none",
            borderLeft: "3px solid rgb(216, 209, 124)",
            paddingLeft: "5px",
            backgroundColor: `rgb(248, 248, 228)`,
          }}
        >
          the Sewol ferry disaster
        </a>{" "}
        , followed by{" "}
        <a
          href="/archive/orange#tragedy-21c"
          style={{
            color: "inherit",
            textDecoration: "none",
            borderLeft: "3px solid rgb(216, 184, 124)",
            paddingLeft: "5px",
            backgroundColor: `rgb(248, 242, 228)`,
          }}
        >
          the Stellar Daisy ferry incident
        </a>{" "}
        ,{" "}
        <a
          href="/archive/violet#tragedy-21c"
          style={{
            color: "inherit",
            textDecoration: "none",
            borderLeft: "3px solid rgb(198, 124, 216)",
            paddingLeft: "5px",
            backgroundColor: `rgb(241, 228, 248)`,
          }}
        >
          the Itaewon tragedy
        </a>{" "}
        , <a href="/archive/green#tragedy-21c">the Osong underpass tragedy</a>,
        and{" "}
        <a
          href="/archive/blue#tragedy-21c"
          style={{
            color: "inherit",
            textDecoration: "none",
            borderLeft: "3px solid rgb(124, 170, 216)",
            paddingLeft: "5px",
            backgroundColor: `rgb(228, 235, 248)`,
          }}
        >
          the Aricell battery factory fire
        </a>
        . These were all catastrophic events in which countless people lost
        their lives - disasters that could have been prevented, should never
        have occurred, and were all caused by human actions.
      </p>
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
  );
}
