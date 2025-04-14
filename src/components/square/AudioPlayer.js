"use client";

import React, { useState, useEffect, useCallback } from "react";
import chordFrequencies from "@/app/(dashboard)/square/components/chordFrequencies";
import chordProgression from "@/app/(dashboard)/square/components/chordProgressions";
import noteToFrequency from "@/app/(dashboard)/square/components/webAudioFunc";

// 코드 요소(문자열 또는 배열)를 4개의 주파수 배열로 변환하는 함수
function getChordFrequencies(chordElement) {
  if (typeof chordElement === "string") {
    return chordFrequencies[chordElement]?.map(noteToFrequency) || [];
  }
  
  if (Array.isArray(chordElement)) {
    const frequencies = chordElement.map(chord => 
      chordFrequencies[chord]?.map(noteToFrequency) || []
    );
    return frequencies.flat();
  }
  
  return [];
}

// 사운드 파일 폴더별 매핑
const soundPaths = {
  queer: ["soojeong_103.mp3"],
  stellar: ["me_ktx_to_seoul.mp3"],
  sewol: ["eunji_study.mp3"],
  osong: ["jiwon_eulsukdo.mp3"],
  aricell: ["20240214-creative-response4.mp3"],
  itaewon: ["minseo_yongsanstation.mp3"]
};

export default function AudioPlayer({ socket, player, className }) {
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [oscillators, setOscillators] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgression, setCurrentProgression] = useState("marching_orig");
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  // 오디오 컨텍스트 및 게인 노드 초기화
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.value = 0.1;
      
      setAudioContext(ctx);
      setGainNode(gain);
      
      return () => {
        ctx.close();
      };
    }
  }, []);

  // 오실레이터 정리
  const cleanupOscillators = useCallback(() => {
    oscillators.forEach(osc => {
      osc.stop();
      osc.disconnect();
    });
    setOscillators([]);
  }, [oscillators]);

  // 코드 재생
  const playChord = useCallback((frequencies) => {
    if (!audioContext || !gainNode) return;
    
    cleanupOscillators();
    
    const newOscillators = frequencies.map(freq => {
      const osc = audioContext.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gainNode);
      osc.start();
      return osc;
    });
    
    setOscillators(newOscillators);
  }, [audioContext, gainNode, cleanupOscillators]);

  // 코드 진행 재생
  useEffect(() => {
    if (!isPlaying) return;
    
    const progression = chordProgression[currentProgression];
    if (!progression) return;
    
    const intervalId = setInterval(() => {
      const chord = progression[currentChordIndex];
      const frequencies = getChordFrequencies(chord);
      playChord(frequencies);
      
      setCurrentChordIndex((prevIndex) => 
        (prevIndex + 1) % progression.length
      );
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
      cleanupOscillators();
    };
  }, [isPlaying, currentProgression, currentChordIndex, playChord, cleanupOscillators]);

  // 소켓 이벤트 핸들링
  useEffect(() => {
    if (!socket) return;

    const handleProgressionChange = (data) => {
      setCurrentProgression(data.progression);
      setCurrentChordIndex(0);
    };

    socket.on("progressionChange", handleProgressionChange);
    return () => socket.off("progressionChange", handleProgressionChange);
  }, [socket]);

  // 오디오 재생/정지 토글
  const togglePlay = () => {
    if (!audioContext) return;
    
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      cleanupOscillators();
    }
  };

  return (
    <div className={className}>
      <button
        onClick={togglePlay}
        className={className}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
      {/* 추가적인 컨트롤이 필요한 경우 여기에 구현 */}
    </div>
  );
}