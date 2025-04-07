"use client";

import React from "react";
import { useParams } from "next/navigation";

// 색상 정보 객체 (이전과 동일)
const tragedies = {
  queer: 0,
  stellar: 32,
  sewol: 60,
  osong: 110,
  aricell: 194,
  itaewon: 265,
};

const explanations = {
  queer: "Investigating the recent catastrophes in Korea, I observed that the representative colors of each disaster consist of five of the six colors of the pride rainbow. If the most recent disaster - the Aricell battery factory fire - has revealed the safety hazards that migrant workers, a group that is not well represented in Korea, must endure, then the hatred faced by the queer community in Korea also falls under a similar hazard. Furthermore, I am reminded of Sergeant Byun Hui-su, a close friend of my friends, who was forcibly discharged after her gender transition. Here, in the final color, red, I wish to encapsulate both my story and Sergeant Byun Hui-su's story, to speak of the pain experienced by Koreans, and queer Koreans, living in these times, the most heartfelt wishes that bloom from that pain, and the love that is built on that foundation.",
  stellar: "In 2014, when the Sewol ferry disaster occurred, people adorned yellow ribbons as a sign of hope that those on board would return safely. We all wished that this would be the last ribbon. However, in 2018, when I entered university in Seoul, I once visited Gwanghwamun. There, alongside the familiar yellow ribbons, I was handed keychains bearing orange ribbons for the Stellar Daisy ferry disaster. How could I have been unaware of this event - the incident happened in March 2017. In 2017, I was in my final year of high school, focusing on my College Scholastic Ability Test (CSAT), and the nation was in turmoil with the presidential impeachment and early presidential election. Perhaps for those reasons, this incident was quietly buried in my memory.",
  sewol: "The Sewol ferry disaster occurred in 2014. On that day, students - just two years older than me - were on what was supposed to be their final school trip in high school. At that time, I was in my third year of middle school and already known as a problematic student who was overly addicted to games. My parents, deciding that I needed to prepare for high school and university, sent me to a math academy, and I remember coming home after studying past 9 o’clock for the first time. Those days passed with the internet’s real-time search rankings and television screens unchanged—that was the day of the Sewol ferry disaster. I clearly recall that on the first day, it was said that everyone had been rescued. However, over the following days, the truth slowly emerged, and the supposed full rescue was revealed to be a blatant lie… I remember the countless citizen volunteers and divers. This has become a collective trauma for our generation.",
  osong: "Concerns about abnormal weather always intensify when its effects come personally. In my case, in 2020, while commuting from Cheonan to Seoul, it rained heavily for an extended period. The KTX is usually considered seriously delayed if it’s more than 10 minutes behind schedule, but that day, with roads flooding in various areas, the KTX I was scheduled to take was delayed by 33 minutes. A landmark supermarket in Cheonan was also flooded, and for several days I couldn’t get to work in Seoul. For me, that memory is filled with both dread and annoyance. And that summer, 2023, felt similar - with heavy rains and signs of impending flooding. Soon after, I heard of another fatal accident nearby. It wasn’t long before I learned that the bus, which became the representative image of that tragedy, was the very same bus that my friend frequently rode.",
  aricell: "While I was studying abroad during a vacation and resting in Korea, I heard news of a major fire in Hwaseong. It was an electrical fire caused by lithium batteries, and most of the casualties were foreign laborers. This catastrophe was the result of a confluence of rampant negligence, shortcuts, and illegal practices - a result of the “risk outsourcing”. If one were to consider only the outsourcing of dangerous tasks through subcontracting, then the Aricell disaster goes even further by highlighting that this outsourcing has spread internationally to migrant workers.",
  itaewon: "In the fall semester of 2022 - my last semester as an undergraduate and the first time I applied for a master’s program abroad - I was living alone in Seoul. I received more than 10 unanswered phone calls from my mother and father, and the landlord banged heavily on the door. Only in the early hours of the morning did I begin to grasp the situation... That is when I learned about the Itaewon tragedy. My landlord was banging the door so heavily just to check if I was alive. I was so worried about my friends that I couldn’t leave Instagram for a while, hoping that the friends who had been in Itaewon would post even a single word assuring they were okay. At that time, we were merely 22 or 23 years old.",
};

export default function TragedyDetail() {
  const params = useParams();
  const { color } = params; // 예: "queer", "stellar", etc.
  const hue = tragedies[color] || 0;
  const fontColor = color === "sewol" ? "#000" : "#fff";

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: fontColor,
        padding: "40px",
      }}
    >
      <h1>{color.toUpperCase()}</h1>
      <p>{explanations[color]}</p>
    </div>
  );
}
