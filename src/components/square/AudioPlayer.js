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

export default function AudioPlayer({ socket, player, className, players }) {
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [volume, setVolume] = useState(0.1);
  const ambientAudioRef = useRef(null);
  const volumeRef = useRef(volume);
  const currentChordIndexRef = useRef(0);
  const bandpassFiltersRef = useRef([]);
  const sourceNodeRef = useRef(null);

  // Keep volume ref in sync
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Initialize audio context and nodes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume context (required for browsers)
      const resumeContext = async () => {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
      };
      resumeContext();

      const gain = ctx.createGain();
      const filters = Array(4).fill().map(() => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 440;
        filter.Q.value = 0;
        filter.connect(gain); // Connect each filter directly to gain
        return filter;
      });
      
      gain.connect(ctx.destination);
      gain.gain.value = volumeRef.current;
      
      setAudioContext(ctx);
      setGainNode(gain);
      bandpassFiltersRef.current = filters;
      
      return () => {
        ctx.close();
      };
    }
  }, []);

  // Update Q values based on number of players
  useEffect(() => {
    if (!bandpassFiltersRef.current.length || !players) return;
    
    const activeWands = Object.values(players).filter(p => p.entered === 1).length;
    const qValue = activeWands * 0.5; // Make the resonance gentler
    
    bandpassFiltersRef.current.forEach(filter => {
      if (filter) filter.Q.value = qValue;
    });
  }, [players]);

  // Volume change handler
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

  // Update filter frequencies based on chord progression
  useEffect(() => {
    const progression = chordProgression["marching_orig"];
    if (!progression || !audioContext || !bandpassFiltersRef.current.length) return;
    
    const updateFilterFrequencies = () => {
      const chord = progression[currentChordIndexRef.current];
      const frequencies = getChordFrequencies(chord);
      
      // Update each filter's frequency
      frequencies.forEach((freq, index) => {
        const filterIndex = index % bandpassFiltersRef.current.length;
        if (bandpassFiltersRef.current[filterIndex]) {
          bandpassFiltersRef.current[filterIndex].frequency.value = freq;
        }
      });
      
      currentChordIndexRef.current = (currentChordIndexRef.current + 1) % progression.length;
    };

    const intervalId = setInterval(updateFilterFrequencies, 1000);
    updateFilterFrequencies(); // Update frequencies immediately
    
    return () => clearInterval(intervalId);
  }, [audioContext]);

  // Play and process ambient sound
  useEffect(() => {
    if (!player?.color || !soundPaths[player.color] || !audioContext || !bandpassFiltersRef.current.length) return;

    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const audio = new Audio(soundPaths[player.color][0]);
    audio.loop = true;
    
    // Create media element source
    const source = audioContext.createMediaElementSource(audio);
    sourceNodeRef.current = source;
    
    // Split audio to all filters in parallel
    bandpassFiltersRef.current.forEach(filter => {
      source.connect(filter);
    });
    
    audio.volume = volumeRef.current;
    audio.play().catch(error => {
      console.log("Audio playback error:", error);
    });
    
    ambientAudioRef.current = audio;
    
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        ambientAudioRef.current = null;
      }
    };
  }, [player?.color, audioContext]);

  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
  );
}