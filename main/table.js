
const Shuffle = require('./shuffle');

const Player = require('./player');

const Logic = require('./logic');

class Table{
    constructor(){
        this.chair = [0, 1, 2, 3];
        this.chairHands = [
            [], [], [], []
        ];
        
        // 明牌
        this.visibleHands = [
            [], [], [], []
        ];
        
        // 暗牌
        this.hiddenHands = [
            [], [], [], []
        ];
        
        this.players = [];
        
        this.fallWall = [];
        this.tableCard = [];
        this.step = -1;
        this.round = 0;
        
        this.current = -1;
        
        this.logic = new Logic( this );
    }
    
    newRanStep(){
        this.step = ~~( Math.random() * this.chair.length );
        return this.step;
    }
    
    nextStep(){
        this.step = ( ( this.step + 1 ) > 3 ) ? 0 : ( this.step + 1 );
        this.round++;
        
        return this.step;
    }
    
    getStep(){
        return this.step;
    }
    
    initPlayerHands(){
        let fallWall = this.fallWall,
            newFallWall = [];
        
        for( let i = 0; i < 13 * 4; i++ ){
            let cursor = i,
                chair = ~~( i / 13 ),
                cursorCard = fallWall[ i ];
            
            this.chairHands[ chair ].push( cursorCard );
            
            fallWall[ i ] = null;
        }
        
        fallWall.forEach( a => ( a && newFallWall.push( a ) ) );
        
        this.fallWall = newFallWall;
    }
    
    init(){
        let shuffleFallWall = new Shuffle(),
            self = this;        
        
        return ;
        
        this.fallWall = shuffleFallWall.newShuffle({
            ranLen:20,
            constCard:[1,2,3, 22,22,22, 13,14,15, 2,2,2, 18],
            chair:0
        });
        
        return ;
        
        this.initPlayerHands();
        
        this.chair.forEach( ( chair ) => {
            
            self.chairHands[ chair ] = self.logic.sortCard( this.chairHands[ chair ] );
            
            self.players.push( new Player( chair, self.chairHands[ chair ], self ) );
            
        } );
        
        this.players[ this.step ].draw();
        this.players[ this.step ].drop( 1 );
        
        
        console.log( this.logic.isPingHu( 0 ) );
        
        console.log( JSON.stringify( this.tableCard ) );
        
        console.log( JSON.stringify( this.fallWall ) );
        
        
        this.players.forEach( ( player ) => {
            player.detail();
        } );
        
    }
    
    newRound(){
        
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
        
        this.initPlayerHands();
        
        this.chair.forEach( ( chair ) => {
            
            self.chairHands[ chair ] = self.logic.sortCard( this.chairHands[ chair ] );
            
            self.players.push( new Player( chair, self.chairHands[ chair ], self ) );
            
        } );
        
        this.players[ step ].setTurn();
        
        return step;
    }
    
    getInfomation(){
        let tableCard = this.tableCard,
            handCards = this.chairHands,
            step = this.step,
            round = this.round,
            current = this.current,
            visibleHands = this.visibleHands,
            hiddenHands = this.hiddenHands;
        
        return {
            tableCard:tableCard,
            handCards:handCards,
            step:step,
            round:round,
            current:current,
            visibleHands:visibleHands,
            hiddenHands:hiddenHands
        };
    }
    
    getCards( chair ){
        return this.logic.getCards( chair );
    }
    
    getLifeCount(){
        return this.fallWall.length;
    }
}


module.exports = Table;