
class Player{
    constructor( chair, cards, table ){
        this.chair = chair;
        this.cards = cards || [];
        
        // 明牌
        this.visibleHands = [];
        
        // 暗牌
        this.hiddenHands = [];
        
        this.table = table;
        
        this.drawLock = false;
        this.dropLock = false;
        
        this.canEat = false;
        this.canPeng = false;
        this.canGang = false;
        this.canHu = false;
    }
    
    limit(){
        this.drawLock = false;
        this.dropLock = false;
        
        this.canEat = false;
        this.canPeng = false;
        this.canGang = false;
        this.canHu = false;
    }
    
    setTurn(){
        this.drawLock = true;
        this.dropLock = false;
    }
    
    eventLock( bool ){
        this.canEat = bool;
        this.canPeng = bool;
        this.canGang = bool;
        this.canHu = bool;
    }
    
    setDrop(){
        this.dropLock = true;
    }
    
    draw(){
        
        if( this.table.fallWall.length == 0 ){
            // 和局
            return ;
        }
        
        if( !this.drawLock ){
            return false;
        }
        
        let card = this.table.fallWall[0];
        
        this.table.fallWall = this.table.fallWall.removeAt(0);
        
        this.cards.push( card );
        
        this.table.chairHands[ this.chair ] = this.table.chairHands[ this.chair ].clone( this.cards );
        
        this.drawLock = false;
        this.dropLock = true;
        
        return {
            card:card,
            handCard:this.cards
        };
    }
    
    drop( idx ){
        
        if( !this.dropLock ){
            return false;
        }
        
        let card = this.cards[ idx ];
        
        this.cards = this.cards.removeAt( idx );
        
        this.cards = this.table.logic.sortCard( this.cards );
        
        this.table.chairHands[ this.chair ] = this.table.chairHands[ this.chair ].clone( this.cards );
        
        this.table.tableCard.unshift( card );
        
        this.table.current = this.table.tableCard[ 0 ];
        
        this.dropLock = false;
        
        this.canEat = false;
        this.canPeng = false;
        this.canGang = false;
        this.canHu = false;
        
        return this.cards;
    }
    
    getEvent(){
        let current = this.table.current,
            cards = this.cards,
            newArr = [],
            result = {};
        
        result['chair'] = this.chair;
        
        if( !this.canEat && !this.canGang && !this.canPeng && !this.canHu ){
            result['canPeng'] = {
                canPeng:false,
                list:[]
            };
            
            result['canEat'] = {
                canEat: false,
                list:[]
            };
            
            result['canGang'] = {
                canGang: false,
                list:[]
            };
            
            return result['canPingHu'] = {
                canPingHu:false
            };
        }
        
        let canPeng = this.table.logic.canPeng( this.cards, current );
        
        result['canPeng'] = {
            canPeng: canPeng.length ? true : false,
            list:canPeng
        };
        
        let canEat = this.table.logic.canEat( this.cards, current );
        
        result['canEat'] = {
            canEat: canEat.length ? true : false,
            list:canEat
        };
        
        let canGang = this.table.logic.canGang( this.chair, current );
        
        result['canGang'] = {
            canGang: canGang.length ? true : false,
            list:canGang
        };
        
        newArr = cards.clone( cards );
        
        newArr.push( current );
        
        newArr = this.table.logic.sortCard( newArr );
        
        let canPingHu = this.table.logic.isPingHu( newArr );
        
        result['canPingHu'] = canPingHu;
        
        return result;
    }
    
    getEventSingal(){
        let result = {},
            newArr = [];
        
        let lastCard = this.cards[ this.cards.length - 1 ];
        
        let canAnGang = this.table.logic.canAnGang( this.chair );
        
        result['canAnGang'] = {
            canAnGang: canAnGang.length ? true : false,
            list:canAnGang
        };
        
        let canZiMo = this.table.logic.isPingHu( this.cards );
        
        result['canPingHu'] = canZiMo;
        
        return result;
    }
    
    eat( arr ){
        let tableCard = this.table.tableCard,
            current = tableCard[ 0 ],
            cards = this.cards;
        
        let nArr = [],
            combox = [];
        
        cards.forEach( ( c, idx ) => {
            ( !arr.includes( idx ) ) && ( nArr.push(c) );
        } );
        
        arr.forEach( ( ar ) => {
            let card = cards[ ar ];
            combox.push( card );
        } );
        
        combox.push( current );
        
        combox = this.table.logic.sortCard( combox );
        
        if( !this.table.logic.isChain( combox ) ){
            return false;
        }
        
        this.visibleHands.push( combox );
        this.table.visibleHands[ this.chair ] = this.visibleHands;
        
        this.table.tableCard = this.table.tableCard.removeAt( 0 );
        
        this.cards = nArr;
        this.table.chairHands[ this.chair ] = nArr;
        
        this.dropLock = true;
        
        this.table.step = this.chair;
        
        return true;
    }
    
    peng( arr ){
        let tableCard = this.table.tableCard,
            current = tableCard[ 0 ],
            cards = this.cards;
        
        let nArr = [],
            combox = [];
        
        cards.forEach( ( c, idx ) => {
            ( !arr.includes( idx ) ) && ( nArr.push(c) );
        } );
        
        arr.forEach( ( ar ) => {
            let card = cards[ ar ];
            combox.push( card );
        } );
        
        combox.push( current );
        
        combox = this.table.logic.sortCard( combox );
        
        if( !this.table.logic.isCommon( combox ) ){
            return false;
        }
        
        this.visibleHands.push( combox );
        this.table.visibleHands[ this.chair ] = this.visibleHands;
        
        this.table.tableCard = this.table.tableCard.removeAt( 0 );
        
        this.cards = nArr;
        this.table.chairHands[ this.chair ] = nArr;
        
        this.dropLock = true;
        
        this.table.step = this.chair;
        
        return true;
    }
    
    gang(){
        
        let tableCard = this.table.tableCard,
            current = tableCard[ 0 ],
            cards = this.cards,
            visibleHands = this.visibleHands,
            self = this,
            side = -1;
        
        // check again
        let canGang = this.table.logic.canGang( this.chair, this.table.current );
        
        if( !canGang.length ){
            return false;
        }
        
        // detect side
        ( cards.includes( current ) ) && ( side = 0 );
        
        visibleHands.forEach( ( arr ) => {
            arr.includes( current ) && ( side = 1 );
        } );
        
        switch( side ){
            case 0 :
                {
                    let nArr = [];
                    
                    cards.forEach( a => ( ( a!=current ) && nArr.push( a ) ) );
                    
                    visibleHands.push( [ current, current, current, current ] );
                    
                    this.cards = nArr;
                    
                    this.table.visibleHands[ this.chair ] = visibleHands;
                    
                    this.table.chairHands[ this.chair ] = nArr;
                }
            break ;
                
            case 1 :
                {
                    
                    for( let i = 0; i < visibleHands.length; i++ ){
                        let arr = visibleHands[i];
                        arr.includes(current) && arr.push( current );
                    }
                    
                    this.table.visibleHands[ this.chair ] = visibleHands;
                    
                }
            break ;
        }
        
        this.table.tableCard = this.table.tableCard.removeAt(0);
        
        this.table.step = this.chair;
        
        return true;
    }
    
    angang(){
        
        let cards = this.cards,
            nArr = [],
            last = cards[ cards.length - 1 ],
            self = this;
        
        // check again
        let canGang = this.table.logic.canAnGang( this.chair );
        
        if( !canGang.length ){
            return false;
        }
        
        this.hiddenHands.push( canGang[0] );
        
        cards.forEach( ( cd ) => ( ( cd != canGang[0][0] ) && ( nArr.push( cd ) ) ) );
        
        this.cards = nArr;
        
        this.table.chairHands[ this.chair ]  = nArr;
        
        this.table.hiddenHands[ this.chair ] = this.hiddenHands;
        
        this.table.step = this.chair;
        
        return true;
    }
    
    recomandEvent(){
        
        let cards = this.cards,
            current = this.table.current;
        
        let pingHu = this.table.logic.isPingHu( cards );
        
        let result = {},
            basicArr = pingHu.cardGray;
        
        let canPeng = this.table.logic.canPeng( basicArr, current );
        
        if( canPeng.length ){
            result['peng'] = canPeng;
            return result;
        }
        
        let canEat = this.table.logic.canEat( basicArr, current );
        
        if( canEat.length ){
            result['eat'] = canEat;
            return result;
        }
        
        return false;
    }
    
    recomands(){
        return this.table.logic.recomands( this.cards, this.chair );
    }
    
    detail(){
        console.log( this.chair, JSON.stringify( this.cards ), this.cards.length );
    }
}

module.exports = Player;