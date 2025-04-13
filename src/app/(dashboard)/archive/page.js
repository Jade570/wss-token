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
        <div style={{ position: "relative", display: "inline-block"}}>
          <div
            style={{
              width: "2.75em",
              height: "1.5em",
              backgroundColor: "#fff",
              border: "1px solid #333",
              borderRadius: "0.75em",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              left: "0.2em",
              top: "0.2em",
              backgroundColor: "#333",
              width: "1.2em",
              height: "1.2em",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "1.45em",
              top: "0.18em",
              backgroundImage: `url("/archive_dark.png")`,
              backgroundSize: "cover",
              width: "1em",
              height: "1em",
              borderRadius: "50%",
            }}
          />
        </div>{" "}
        on the bottom left, you can step into the enchanted square or return to this personal
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
