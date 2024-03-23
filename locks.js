module.exports = {
  home: {
    nodes: [
      //{name: 'center', width: 0, height: 0, x: width / 2, y: height / 2, fixed: true},
      {name: 'SupremeCourt',   width: 21+ 9/16, height: 18+ 9/16, drop: 4+ 9/16 },
      {name: 'AkronLaw',       width: 21+11/16, height: 18+ 3/ 4, drop: 4+ 1/ 2 },
      {name: 'Malki',          width: 14+ 1/16, height: 12+ 1/16, drop: 2+ 5/ 8 },
      {name: 'Someday',        width: 25+23/32, height: 18+ 3/ 4, drop: 4+ 3/16 },
      {name: 'SirIan',         width: 19+27/32, height: 25+ 3/32, drop: 7       },
      {name: 'Katharine',      width: 14+ 9/16, height: 17+ 9/16, drop: 4+ 1/ 2 },
      {name: 'Butterfly',      width: 10+13/16, height:  8+ 7/ 8, drop:    7/ 8 },
      {name: 'Ravenclaw',      width:  9+ 7/16, height:  9+ 7/16, drop: 1+ 7/16 },
      {name: 'DoctorHoo',      width: 29+ 7/16, height: 17+ 1/16, drop: 4       },
      {name: 'GoldenTreasure', width: 16+ 3/ 4, height: 13+ 3/ 4, drop: 1+ 7/ 8 },
      {name: 'ElevenDoctors',  width: 17+ 1/ 2, height: 14+ 1/ 2, drop: 3+ 1/ 2 },
      {name: 'AynRand',        width: 15      , height: 15      , drop: 3+ 1/ 8 },
      {name: 'Novy',           width: 12+ 5/ 8, height: 24      , drop: 1       },
    ],
    locks: { // top-left corner!
      SupremeCourt:   { x:  32+21/32, y:   2+21/32 },
      AkronLaw:       { x:  60+ 3/ 8, y:  22+23/32 },
      Malki:          { x:  55+11/16, y:   9+ 5/32 },
      Someday:        { x:  97+11/16, y:   3+11/16 },
      SirIan:         { x:  39+ 1/16, y:  22+23/32 },
      Katharine:      { x:  97+21/32, y:  23+15/16 },
      Butterfly:      { x:  71+ 7/32, y:  12+11/32 },
      Ravenclaw:      { x: 113+11/16, y:  23+15/16 },
      DoctorHoo:      { x:  76+29/32, y:  43       },
      GoldenTreasure: { x:  20+13/16, y:  38+23/32 },
      ElevenDoctors:  { x:  20+ 1/16, y:  22+23/32 },
      AynRand:        { x:  60+13/32, y:  42+31/32 },
      Novy:           { x:  83+17/32, y:  17+ 1/ 2 }
    }
  }
};