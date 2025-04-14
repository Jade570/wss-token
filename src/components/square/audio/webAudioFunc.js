// 음표 이름을 주파수로 변환하는 유틸리티 함수
function noteToFrequency(note) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note_regex = /^([A-G][b#]?)(\d+)$/;
  const match = note.match(note_regex);
  
  if (!match) return null;
  
  const [, noteName, octave] = match;
  let noteIndex = notes.indexOf(noteName.replace('b', '#'));
  
  if (noteIndex === -1) {
    // 플랫인 경우 반음 낮추기
    noteIndex = notes.indexOf(
      noteName.replace('b', '')) - 1;
    if (noteIndex === -2) noteIndex = 11;
  }
  
  const frequency = 440 * Math.pow(2, (noteIndex - 9) / 12 + (parseInt(octave) - 4));
  return frequency;
}

export default noteToFrequency;