"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import chordFrequencies from "./audio/chordFrequencies";
import chordProgression from "./audio/chordProgressions";
import noteToFrequency from "./audio/webAudioFunc";

// 색상별 사운드 파일 매핑
const soundPaths = {
  queer: ["/sounds/red/soojeong_103.mp3"],
  stellar: ["/sounds/orange/me_ktx_to_seoul.mp3"],
  sewol: ["/sounds/yellow/eunji_study.mp3"],
  osong: ["/sounds/green/jiwon_eulsukdo.mp3"],
  aricell: ["/sounds/blue/20240214-creative-response4.mp3"],
  itaewon: ["/sounds/violet/minseo_yongsanstation.mp3"]
};

// 코드 요소를 주파수로 변환하는 함수
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

export default function AudioPlayer({ socket, player, className }) {
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [oscillators, setOscillators] = useState([]);
  const [isChordPlaying, setIsChordPlaying] = useState(false);
  const [currentProgression, setCurrentProgression] = useState("marching_orig");
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [volume, setVolume] = useState(0.1);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const ambientAudioRef = useRef(null);

  // 오디오 컨텍스트 초기화
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.value = volume;
      
      setAudioContext(ctx);
      setGainNode(gain);
      
      return () => {
        ctx.close();
      };
    }
  }, []);

  // 볼륨 변경 핸들러
  const handleVolumeChange = useCallback((event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (gainNode) {
      gainNode.gain.value = newVolume;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = newVolume;
    }
  }, [gainNode]);

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
    if (!isChordPlaying) return;
    
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
  }, [isChordPlaying, currentProgression, currentChordIndex, playChord, cleanupOscillators]);

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

  // 앰비언트 사운드 재생
  const toggleAmbientSound = useCallback(() => {
    if (!player?.color || !soundPaths[player.color]) return;

    if (isAmbientPlaying) {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
    } else {
      const audio = new Audio(soundPaths[player.color][0]);
      audio.loop = true;
      audio.volume = volume;
      audio.play();
      ambientAudioRef.current = audio;
    }
    
    setIsAmbientPlaying(!isAmbientPlaying);
  }, [player?.color, isAmbientPlaying, volume]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
      cleanupOscillators();
    };
  }, [cleanupOscillators]);

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => setIsChordPlaying(!isChordPlaying)}
          style={{
            padding: "8px 16px",
            backgroundColor: isChordPlaying ? "#666" : "#444",
            color: "#fff",
            border: "solid #888 2px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isChordPlaying ? "Stop Chord" : "Play Chord"}
        </button>
        <button
          onClick={toggleAmbientSound}
          style={{
            padding: "8px 16px",
            backgroundColor: isAmbientPlaying ? "#666" : "#444",
            color: "#fff",
            border: "solid #888 2px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isAmbientPlaying ? "Stop Ambient" : "Play Ambient"}
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ color: "#fff" }}>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: "100px" }}
        />
      </div>
    </div>
  );
}