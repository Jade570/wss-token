"use client";
import React, { useRef, useState, useEffect } from "react";
import chordFrequencies from "./chordFrequencies";
import chordProgression from "./chordProgressions";
import noteToFrequency from "./webAudioFunc";

// chordProgression의 한 요소(문자열 또는 배열)를 받아 4개의 주파수 배열로 변환하는 함수
function getChordFrequencies(chordElement) {
  if (typeof chordElement === "string") {
    const notes = chordFrequencies[chordElement];
    if (!notes) return [0, 0, 0, 0];
    return notes.map(noteToFrequency);
  } else if (Array.isArray(chordElement)) {
    return chordElement.map((subChord, index) => {
      const notes = chordFrequencies[subChord];
      if (!notes) return 0;
      return noteToFrequency(notes[index] || notes[0]);
    });
  }
  return [0, 0, 0, 0];
}

// 예시: 각 폴더 내에 존재하는 파일명 배열 (실제 파일명으로 수정)
// const soundFiles = {
//   aricell: ["20240214-creative-response4.wav", "joo_usarmy.wav"],
//   itaewon: ["minseo_yongsanstation.wav", "myungjin_sogang.wav"],
//   osong: ["jiwon_eulsukdo.wav", "woojin_planeandbird.wav"],
//   queer: ["joo_crazybirds.wav", "soojeong_103.wav"],
//   sewol: ["eunji_study.wav", "jiwon_myungdong.wav"],
//   stellar: ["me_ktx_to_seoul.wav", "zero_midnight_lab_alone.wav"],
// };

const soundFiles = {
  aricell: ["20240214-creative-response4.mp3"],
  itaewon: ["minseo_yongsanstation.mp3"],
  osong: ["jiwon_eulsukdo.mp3"],
  queer: ["soojeong_103.mp3"],
  sewol: ["eunji_study.mp3"],
  stellar: ["me_ktx_to_seoul.mp3"],
};


const NativeAudioPlayerWithChordProgression = (props) => {
  const { socket } = props.socket;
  const player = props.player;

  // 자동 재생을 위해 컴포넌트 마운트 시 playAudio()를 호출할 수 있음.
  // (브라우저의 자동 재생 제한에 주의하십시오.)

  // 0.01 → 100 의 범위를 log10 스케일(-2 → 2)로 변환
  const minExp = Math.log10(0.01); // -2
  const maxExp = Math.log10(100); //  2

  // Ref 및 상태 선언
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const filterRefs = useRef([]); // 4개의 밴드패스 필터
  const autoMakeupGainRef = useRef(null);
  const volumeGainRef = useRef(null); // 볼륨 컨트롤 노드
  const timeoutsRef = useRef([]); // 스케줄링 타이머 ID 저장
  const measureIndexRef = useRef(0);
  const autoMakeupIntervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [qValue, setQValue] = useState(0); // 초기 Q값 30
  const qValueRef = useRef(qValue);

  // 볼륨 상태 (0 ~ 1 사이, 초기값 1)
  const [volume, setVolume] = useState(1);

  // chordProgression 선택 상태 (default: marching_new)
  const [selectedProgression, setSelectedProgression] =
    useState("marching_new");
  const selectedProgressionRef = useRef("marching_new");

  // Socket.IO 클라이언트 연결 (필요 시 사용)
  const socketRef = useRef(null);

  useEffect(() => {
    qValueRef.current = qValue;
  }, [qValue]);

  useEffect(() => {
    if (!socket) return;
    const handlePlayersForQ = (data) => {
      // data는 players 객체로 전달됩니다.
      const enteredCount = Object.values(data).filter(
        (player) => player.entered === 1
      ).length;
      console.log("Entered count:", enteredCount);
      // Q 값을 enteredCount에 비례해서 결정합니다.
      // 예를 들어, 기본 Q 값 30에 enteredCount 당 5씩 증가한다고 가정하면:
      const newQ = enteredCount * 5;
      setQValue(newQ);
    };

    socket.on("players", handlePlayersForQ);
    return () => {
      socket.off("players", handlePlayersForQ);
    };
  }, [socket]);

  // BPM 및 마디 관련 상수
  const BPM = 90;
  const beatsPerMeasure = 4;
  const measureDuration = (beatsPerMeasure * 60) / BPM; // 한 마디(4박자) 지속시간(초)

  const playAudio = async () => {
    try {
      // AudioContext 생성 및 활성화
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // 플레이할 소리 파일 선택
      // 먼저 player.color에 해당하는 파일 리스트를 가져오고, 그 중 랜덤으로 하나 선택합니다.
      const files = soundFiles[player.color];
      console.log(files);
      if (!files || files.length === 0) {
        throw new Error(`No sound files found for color: ${player.color}`);
      }
      const randomIndex = Math.floor(Math.random() * files.length);
      const randomFile = files[randomIndex];
      const soundPath = `sounds/${player.color}/${randomFile}`;
      console.log("Playing sound from:", soundPath);

      // sound 파일 불러오기 및 디코딩
      const response = await fetch(soundPath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);


      // AudioBufferSourceNode 생성 (루프 재생)
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      sourceRef.current = source;

      // 4개의 밴드패스 필터 생성 (각 필터 초기 Q: qValue, 초기 frequency는 440Hz)
      const filters = [];
      for (let i = 0; i < 4; i++) {
        const filter = audioContext.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.value = qValue;
        filter.frequency.value = 440;
        filters.push(filter);
      }
      filterRefs.current = filters;

      // DynamicsCompressorNode 생성
      const compressor = audioContext.createDynamicsCompressor();

      // Auto-Makeup Gain 노드 생성 (초기 base gain 적용)
      const baseGain = 1;
      const autoMakeupGain = audioContext.createGain();
      autoMakeupGain.gain.value = baseGain;
      autoMakeupGainRef.current = autoMakeupGain;

      // 볼륨 컨트롤을 위한 Gain 노드 생성 및 초기 값 설정
      const volumeGain = audioContext.createGain();
      volumeGain.gain.value = volume;
      volumeGainRef.current = volumeGain;

      // Analyser 노드 생성 (compressor 출력 RMS 측정을 위해)
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Float32Array(analyser.fftSize);

      // 오디오 체인 구성: source → 각 filter → compressor → autoMakeupGain → volumeGain → destination
      // compressor의 출력은 analyser에도 연결하여 RMS 측정
      filters.forEach((filter) => {
        source.connect(filter);
        filter.connect(compressor);
      });
      compressor.connect(autoMakeupGain);
      autoMakeupGain.connect(volumeGain);
      volumeGain.connect(audioContext.destination);
      compressor.connect(analyser);

      // 재생 시작
      source.start(0);

      // Auto-Makeup Gain 업데이트 (100ms 간격)
      const target = 0.05; // 목표 RMS (필요에 따라 조정)
      const epsilon = 0.001;
      const updateAutoMakeup = () => {
        analyser.getFloatTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        let makeupFactor = target / (rms + epsilon);
        makeupFactor = Math.min(Math.max(makeupFactor, 0.5), 2); // clamp: 0.5~2

        // baseGain은 Q값에 따라 결정
        const baseGainNow =
          0.5 + 2 * (Math.log(qValueRef.current) / Math.log(700));
        const finalGain = baseGainNow * makeupFactor;
        autoMakeupGain.gain.exponentialRampToValueAtTime(
          finalGain,
          audioContext.currentTime + 0.1
        );
      };

      const autoMakeupInterval = setInterval(updateAutoMakeup, 100);
      autoMakeupIntervalRef.current = autoMakeupInterval;

      // Chord Progression 스케줄링 함수 (매 마디마다 필터의 frequency와 Q 값을 업데이트)
      measureIndexRef.current = 0;
      timeoutsRef.current = [];
      const scheduleMeasure = () => {
        // 현재 선택된 progression 사용 (버튼 클릭으로 변경됨)
        const progression = chordProgression[selectedProgressionRef.current];
        if (!progression) {
          console.error(
            `chordProgression.${selectedProgressionRef.current}이 정의되어 있지 않습니다.`
          );
          return;
        }
        const currentElement =
          progression[measureIndexRef.current % progression.length];

        // 매 마디마다 필터의 Q값을 최신 qValue로 재적용
        filterRefs.current.forEach((filter) => {
          filter.Q.value = qValueRef.current;
        });

        if (typeof currentElement === "string") {
          // 문자열이면 한 마디 전체에 동일한 chord 적용
          const freqs = getChordFrequencies(currentElement); // 4개 주파수 배열
          filterRefs.current.forEach((filter, index) => {
            filter.frequency.setTargetAtTime(
              freqs[index],
              audioContext.currentTime,
              0.01
            );
          });
          console.log(
            `Bar ${measureIndexRef.current + 1}: ${currentElement}`,
            freqs
          );
          measureIndexRef.current++;
          const tId = setTimeout(scheduleMeasure, measureDuration * 1000);
          timeoutsRef.current.push(tId);
        } else if (Array.isArray(currentElement)) {
          // 배열이면 한 마디를 서브 요소 수만큼 나눔
          const subdivisions = currentElement.length;
          const subDuration = measureDuration / subdivisions;
          currentElement.forEach((subChord, idx) => {
            const tId = setTimeout(() => {
              // 서브 코드 적용 시에도 Q값 재적용
              filterRefs.current.forEach((filter) => {
                filter.Q.value = qValueRef.current;
              });
              const freqs = getChordFrequencies(subChord);
              filterRefs.current.forEach((filter, index) => {
                filter.frequency.setTargetAtTime(
                  freqs[index],
                  audioContext.currentTime,
                  0.01
                );
              });
              console.log(
                `Bar ${measureIndexRef.current + 1} - Subdivision ${
                  idx + 1
                }/${subdivisions}: ${subChord}`,
                freqs
              );
            }, idx * subDuration * 1000);
            timeoutsRef.current.push(tId);
          });
          measureIndexRef.current++;
          const tId = setTimeout(scheduleMeasure, measureDuration * 1000);
          timeoutsRef.current.push(tId);
        }
      };

      scheduleMeasure();
      setIsPlaying(true);
    } catch (error) {
      console.error("오디오 재생 중 오류 발생:", error);
    }
  };

  // 정지 함수: 타이머와 노드를 정리합니다.
  const stopAudio = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
    if (autoMakeupIntervalRef.current) {
      clearInterval(autoMakeupIntervalRef.current);
      autoMakeupIntervalRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      filterRefs.current.forEach((filter) => filter.disconnect());
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    // 컴포넌트가 마운트되면 자동 재생 시도 (브라우저 자동 재생 제한에 주의)
    playAudio();
    return () => {
      stopAudio();
    };
  }, []);

  // 볼륨 슬라이더 변경 이벤트 핸들러
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // 볼륨 노드가 이미 생성되었다면 바로 업데이트
    if (volumeGainRef.current) {
      volumeGainRef.current.gain.value = newVolume;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 1000,
      }}
    >
      <div>
        <label htmlFor="volumeSlider"></label>
        <input
          id="volumeSlider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default NativeAudioPlayerWithChordProgression;
