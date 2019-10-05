# mahjong-logic

Mahjong basic core regular version.

```
[
    1, 2, 3, 4, 5, 6, 7, 8, 9, // 万字牌
    11, 12, 13, 14, 15, 16, 17, 18, 19, // 索字牌
    21, 22, 23, 24, 25, 26, 27, 28, 29, // 筒字牌
    31, 32, 33, 34, // 东 南 西 北
    41, 42, 43, // 中 发 白
]
```


```
const Table = require('./index');

let table = new Table();
```


```
let step = table.newRound(),
    cards = table.getCards(),
    lifeCount = table.getLifeCount();
    
```

```
// table newRound

let shuffleFallWall = new Shuffle(),
  self = this;

let step = this.newRanStep();

this.fallWall = shuffleFallWall.newShuffle({
  ranLen:20
});

// 配牌设置
/*
this.fallWall = shuffleFallWall.newShuffle({
  ranLen:20,
  constCard:[1,2,3, 22,22,22, 13,14,15, 2,2,2, 22],
  chair:3
});
*/
  
```

```
table.logic.isPingHu( chair );
table.logic.isPingHu( [1,2,3, 22,22,22, 13,14,15, 2,2,2, 25,25] );
```

```
let chair = 0;
let player = table.players[chair];

player.drop
player.draw
player.eat
player.peng
player.gang

```
