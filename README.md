# mahjong-logic

Mahjong basic core regular version.

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
