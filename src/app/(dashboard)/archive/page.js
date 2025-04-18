"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";

const components = {
  a: ({ href, children }) => (
    <a
      href={href}
      className={styles.markdownLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  p: ({ children }) => (
    <p className={styles.markdownParagraph}>{children}</p>
  ),
  li: ({ children }) => (
    <li className={styles.markdownListItem}>{children}</li>
  ),
};

// 메인 페이지 컴포넌트
export default function TragediesPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        Where Does Melancholy Come From, and Where Is It Heading?
      </h1>
      <h3 className={styles.pageSubtitle}>우울은 어디에서 와서 어디로 가는걸까?</h3>

      <h2 className={styles.sectionTitle}>WELCOME</h2>
      <div className={styles.markdownParagraph}>
        Welcome to my private space of tender and shy thoughts - where sorrows,
        cherished memories, and hopes intertwine. Explore the reflections tied
        to each color and discover your own magical hue. By clicking on the toggle
        <span style={{ position: "relative", display: "inline-block", marginTop: "-0.2em" }}>
          <span
            style={{
              width: "2.75em",
              height: "1.5em",
              backgroundColor: "#fff",
              border: "1px solid #333",
              borderRadius: "0.75em",
              display: "inline-block",
              verticalAlign: "middle",
              marginLeft: "0.5em",
              marginRight: "0.5em",
              position: "relative"
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "0.7em",
              top: "0.2em",
              backgroundColor: "#333",
              width: "1.2em",
              height: "1.2em",
              borderRadius: "50%",
              display: "inline-block"
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "1.95em",
              top: "0.18em",
              backgroundImage: `url("/archive_dark.png")`,
              backgroundSize: "cover",
              width: "1em",
              height: "1em",
              borderRadius: "50%",
              display: "inline-block"
            }}
          />
        </span>
        on the bottom left, you can step into the enchanted square or return to
        this personal haven to read more.
      </div>

      <hr className={styles.divider} />
      <h2 className={styles.sectionTitle}>Magical Girls Metaphor</h2>

      <ReactMarkdown components={components}>
        {`The magical girl metaphor heterogeneously counters anti-feminism, imperialism, fascism, and Eurocentrism. This is because the 'magical girl' genre itself is always criticized for reinforcing patriarchy by being invariably associated with sexuality. However, magical girls are always the main agents of transformation - that is, they are ever-changing beings.

Not only do magical girls within their series, but the very genre itself has continually evolved in a meta-critical manner. Initially, if it merely objectified girls, later it incorporated narratives with a more female-subjective perspective through the characteristics of girls' comics, and it commercially attracted male viewers through the teleological gaze of girls positioned as an intermediate stage between adult women and children [(Saito, 2014)](https://www.cambridge.org/core/journals/journal-of-asian-studies/article/magic-shojo-and-metamorphosis-magical-girl-anime-and-the-challenges-of-changing-gender-identities-in-japanese-society/AAA8B9C5895D35A48C9EFC28495D4F9B?utm_campaign=shareaholic&utm_medium=copy_link&utm_source=bookmark). Moreover, the scope of "girls (shojo)" has been expanded to a broader category - typically those defined as powerless, those who must conceal their identity, or the socially disadvantaged (or those who wish to be seen as such).

Because of this, they align with Karen Barad's ontology - agential reality -, which views phenomena in themselves rather than as mere material substances. They change freely and do not possess a "solid identity [\(Barad, 2015\)](https://doi.org/10.1215/10642684-2843239)." The most important aspect of magical girls, "girlishness," operates in a similar way.

It is entirely pure and asexual, and it can change in one way or another through transformation. "Cuteness and the grotesque overlap, pull, and depend on each other [(Kwon Juria (2018)](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE09024446)"—this is the unique characteristic of magical girls, comparable to other Western heroes: adding the "cuteness" attribute, these magical girls sing of "world peace" and love, and in doing so, they represent diversity and change rather than uniformity, thereby countering Eurocentrism, imperialism, and anti-feminism.`}
      </ReactMarkdown>

      <ReactMarkdown components={components}>
        {`
#### Bibliography
1. Saito, K. (2014). Magic, Shōjo, and Metamorphosis: Magical Girl Anime and the Challenges of Changing Gender Identities in Japanese Society. *The Journal of Asian Studies*, 73(1), 143–164. [https://doi.org/10.1017/S0021911813001708](https://doi.org/10.1017/S0021911813001708)
2. Barad, K. (2015). TransMaterialities: Trans*/Matter/Realities and Queer Political Imaginings. *GLQ: A Journal of Lesbian and Gay Studies*, 21(2–3), 387–422. [https://doi.org/10.1215/10642684-2843239](https://doi.org/10.1215/10642684-2843239)          
3. (Kwon Juria (2018). Cuteness and disability, cultural play of deformed things. *The Korean Literature Association*, (79), 35-66.[https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE09024446](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE09024446)`}
      </ReactMarkdown>

      <hr className={styles.divider} />
      <h2 className={styles.sectionTitle}>Tragedies in the 21st Century Korea, Ribbons, and Colors</h2>
      <p className={styles.markdownParagraph}>
        The tragedies in the 21st Century Korea include{" "}
        <a
          href="/archive/yellow#tragedy-21c"
          className={styles.markdownLink}
        >
          the Sewol ferry disaster
        </a>{" "}
        , followed by{" "}
        <a
          href="/archive/orange#tragedy-21c"
          className={styles.markdownLink}
        >
          the Stellar Daisy ferry incident
        </a>{" "}
        ,{" "}
        <a
          href="/archive/violet#tragedy-21c"
          className={styles.markdownLink}
        >
          the Itaewon tragedy
        </a>{" "}
        ,{" "}
        <a
          href="/archive/green#tragedy-21c"
          className={styles.markdownLink}
        >
          the Osong underpass tragedy
        </a>
        , and{" "}
        <a
          href="/archive/blue#tragedy-21c"
          className={styles.markdownLink}
        >
          the Aricell battery factory fire
        </a>
        . These were all catastrophic events in which countless people lost
        their lives - disasters that could have been prevented, should never
        have occurred, and were all caused by human actions.
      </p>

      <hr className={styles.divider} />
      <h2 className={styles.sectionTitle}>The Space - Jade Scape</h2>
      <p className={styles.markdownParagraph}>
        {`The endlessly stretching horizon from the left end to right end of the sight was, paradoxically, the most isolated space dividing regions, and the gap in between was the only place where a small, lost human could pause to catch their breath alone.

Nature tends to stretch its hand wide to embrace me.
        
But this is never mother-like.
        
My mother warmly hugs me but is not wide as nature. She hugs only a selective self of me.

The horizon, on the other hand, is not warm. However, it accepts every part of me. It is me who wants only a selective part of nature, but the horizon still also invites me to its dimension.

The dimension across the horizon is like a Mobius' loop - a twisted parallel dimension of ours. I lay down there freely, just like I could in the other world, but it is 'freer' than one.

The cool breeze, which is different from mother, gently guides into this twisted world. Nature is never mother-like, nor women-like. It is itself...

The curse of agriculture and Patriarchy, I am the successor of them but also a terminator of them. In this free space, I experiment different things, bring these semiotic strings that tied my families of 3 generations, into a twisted material world, and purify with Jade - my own power.

Jade Scape - that is what the horizon-led parallel twisted world is called.

My father's ability is to materialize things into a form of machine. With my jade-sound ability combined, I will create a curse-purifying instrument machine. I have an inherit ability - not innate, but by his affinity and house culture he constructed. Which is also patriarchic, but note that he gave patriarchal power to woman me. (Yet not to queer me.) As a succession process, look how I freely roam around my own rice field, sing for the termination of the generation- descending curse, yet greedily select from the nature, then create (and show) my sense of guilt.`}
      </p>

      <style jsx>{`
        a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s;
          border-style: dotted;
          border: none;
          border-left: 3px solid rgb(143, 217, 216);
          padding-left: 5px;
          background-color: rgb(228, 248, 244);
        }
        hr {margin:40px 0;
            max-width: 800px;}
        h2 {
          padding: 10px;
          text-align: start;
          font-family: "Special Gothic Expanded One", "sans-serif";
          text-indent: 0;
          color: #333;
        }}
      `}</style>
    </div>
  );
}
