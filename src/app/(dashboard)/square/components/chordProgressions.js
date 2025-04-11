const chordProgression = {
    //임을 위한 행진곡 원 악보 코드진행행
    "marching_orig": ["Am", "Am", "Am", "E7",
        "Dm", "Am", "E7", "Am",
        "Am", "Am", "Am", "E7",
        "Dm", "Am", "E7", "Am",
        "F", "Am", "C", "E7",
        "F", "Am", "C", "G",
        "Am", "Dm", "Am", "E7",
        "Am", "Am", "E7", "Am"],

    // 임을 위한 행진곡 최도은버전  C minor, https://youtu.be/-6gXbgUEc_c?si=Z9g2yPcE3xr4Loj8
    "marching_new": [
        "Cm", "Cm", ["Cm", "Cm", "Cm", "Ddim7"], ["Eb", "CtoE"],
        "Fm", "Cm", "G", "Cm",
        "Cm", "Cm", ["Cm", "Cm", "Cm", "Ddim7"], ["Eb", "CtoE"],
        "Fm", "Cm", "G", "Cm",
        "Fm", "Cm", "Bb", ["Eb", "CtoE"],
        "Fm", "Cm", "Dhalfdim7", ["Csus4", "G"],
        "Cm", "Fm", "Eb", "G",
        "Cm", "Eb", "G", "Cm"
      ],
     
    //   
    "new_world_intro":[
        "C", "C", "D", "D"
    ],

    "new_world_verse1":[
        "C", ["Bm7", "Em"], ["Am7","B7"], ["Em", "Bm7"],
        "C", "Bm7", "Am7", ["EmtoB", "B7"],
    ],

    "new_world_verse2":[
        "C", ["Bm7", "Em"], ["Am7","D7"],["G", "G7"],
        ["C", "D7"], ["Bm7", "Em"], "F", "D",
    ],

    "new_world_highlight": [
        ["C", "D"], "Em", ["C", "D"], ["Esus4", "Em"],
        ["C", "D"],["Bm7", "Em"],"F", ["Bm7", "B"],
    ],

}

export default chordProgression;


