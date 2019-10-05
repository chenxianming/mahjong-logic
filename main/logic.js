
class Logic{
    constructor( table ){
        this.table = table;
    }
    
    sortCard( cards ){
        return cards.sort( (a, b) => ( a - b ) );
    }
    
    // 连牌一组3个
    isChain( arr ){
        
        if( arr[0] > 30 ){ // 只有万字牌， 索字牌， 筒字牌可以吃牌
            return false;
        }
        
        let a = arr.sort( ( a, b ) => ( a - b ) ),
            result = true;
        
        for( let i = 0; i < a.length; i++ ){
            ( ( a[i+1] ) && ( Math.abs( a[i] - a[i+1] ) != 1 ) ) && ( result = false );
        }
        
        return result;
    }

    // 同色一组3个, 4个为杠
    isCommon( arr ){
        let a = arr.sort( ( a, b ) => ( a - b ) ),
            result = true;
        
        for( let i = 0; i < a.length; i++ ){
            ( ( a[i+1] ) && ( a[i] - a[i+1] != 0 ) ) && ( result = false );
        }
        
        return result;
    }
    
    canPeng( cards, current ){
        
        let combox = [];
        
        for( let i = 0; i < cards.length; i++ ){
            let last = i + 1;
            
            if( !cards[last] ){
                continue ;
            }
            
            let arr = [cards[i], cards[i+1], current];
            
            if( this.isCommon( arr ) ){
                combox.push( [cards[i], cards[i+1]] );
            }
            
        }
        
        return combox;
    }
    
    canGang( chair, current ){
        let cards = this.table.chairHands[ chair ],
            vis = this.table.visibleHands[ chair ];
        
        let combox = [];
        
        for( let i = 0; i < cards.length; i++ ){
            let last = i + 2;
            
            if( !cards[last] ){
                continue ;
            }
            
            let arr = [cards[i], cards[i+1], cards[i+2], current];
            
            if( this.isCommon( arr ) ){
                combox.push( [cards[i], cards[i+1], cards[i+2]] );
            }
        }
        
        vis.forEach( ( group, idx ) => {
            
            for( let i = 0; i < group.length; i++ ){
                let last = i + 2;

                if( !group[last] ){
                    continue ;
                }

                let arr = [group[i], group[i+1], group[i+2], current];

                if( this.isCommon( arr ) ){
                    combox.push( [ group[i], group[i+1], group[i+2] ] );
                }
            }
            
        } );
        
        return combox;
    }
    
    canAnGang( chair ){
        
        let cards = this.table.chairHands[ chair ],
            combox = [];
        
        let numbs = {};
        
        cards.forEach( ( cd ) => {
            ( numbs.hasOwnProperty(cd) ) ? numbs[ cd ]++ : ( numbs[ cd ] = 1 );
        } );
        
        for( let key in numbs ){
            ( numbs[ key ] == 4 ) && ( combox.push( [ key*1, key*1, key*1, key*1 ] ) );
        }
        
        return combox;
    }
    
    canEat( cards, current ){
        
        let combox = [];
        
        for( let i = 0; i < cards.length; i++ ){
            let last = i + 1;
            
            if( !cards[last] ){
                continue ;
            }
            
            let arr = [cards[i], cards[i+1], current];
            
            if( this.isChain( arr ) ){
                combox.push( [cards[i], cards[i+1]] );
            }
            
        }
        
        return combox;
    }
    
    isPingHu( chair ){
        
        let cards = ( typeof( chair ) == 'object' ) ? chair : this.table.chairHands[ chair ],
            cardsClone = cards.clone( cards ),
            combox = [],
            self = this,
            result = {};
        
        let nCard = cards.clone( cards ),
            arr = this.sortCard( nCard );
        
        let tArr = arr.clone( arr );
        
        arr.forEach( function( card, idx ){
            
            arr.forEach( function( card2, idx2 ){
                
                if( idx == idx2 ){
                    return ;
                }
                
                arr.forEach( function( card3, idx3 ){
                    
                    if( tArr[idx3] == null ){
                        return ;
                    }
                    
                    if( tArr[idx2] == null ){
                        return ;
                    }
                    
                    if( tArr[idx] == null ){
                        return ;
                    }
                    
                    if( idx == idx3 || idx == idx2 || idx2 == idx3 ){
                        return ;
                    }
                    
                    let gArr = [],
                        iArr = [];
                    
                    gArr.push( card, card2, card3 );
                    iArr.push( idx, idx2, idx3 );
                    
                    gArr = self.sortCard( gArr );
                    
                    if( ( self.isChain(gArr) || self.isCommon( gArr ) ) ){
                        tArr[ idx ] = null;
                        tArr[ idx2 ] = null;
                        tArr[ idx3 ] = null;
                        
                        combox.push( gArr );
                    }
                    
                } );
                
            } );
            
        } );
        
        let nArr = [];

        tArr.forEach( a => ( a && nArr.push(a) ) );  
        
        result['cards'] = cards;
        result['combox'] = combox;
        result['cardGray'] = nArr;
        
        result['isPingHu'] = ( ( nArr[0] == nArr[1] ) && ( nArr.length == 2 ) ) ? true : false;
        
        return result;
    }
    
    getCards( chair ){
        return ( !isNaN( chair ) ) ? this.table.chairHands[ chair ] : this.table.chairHands;
    }
    
    getVisible(){
        return this.table.visibleHands;
    }
    
    getTableCard(){
        return this.table.tableCard;
    }
    
    recomandEvent(){
        // 推荐事件执行
        
    }
    
    recomands( cards, chair ){
        
        // 推荐事件
        
        let pinghu = this.isPingHu( cards );
        
        if( pinghu.isPingHu ){
            return false;
        }
        
        let visibles = this.getVisible();
        
        let tableCard = this.getTableCard();
        
        let preSave = [],
            recomands = [];
        
        pinghu.cardGray.forEach( ( card, idx ) => {
            
            let cg = pinghu.cardGray;
            
            if( ( ( cg[idx - 1] ) && ( Math.abs( cg[ idx ] - cg[idx - 1] ) < 2 ) ) || ( cg[idx + 1] && ( Math.abs( cg[ idx ] - cg[idx + 1] ) < 2 ) ) ){
                preSave.push( idx );
            }
            
        } );
        
        pinghu.cardGray.forEach( (cd, idx) => ( ( !preSave.includes( idx ) ) && ( recomands.push( cd ) ) ) );
        
        if( pinghu.cardGray.length <= 2 ){
            // 是否准备听牌
        }
        
        // 判断听牌列表中是否重复超过2次
        for( let a = 0; a < recomands.length; a++ ){
            
            let rec = recomands[ a ];
            
            visibles.forEach( ( vArr, idx ) => {
                
                vArr.forEach( ( vi ) => {
                    if( chair != idx ){
                        if( vi.repeat( rec ) >= 2 ){
                            recomands[ a ] = null;
                        }
                    }
                } );
                
            } );
        }
        
        let fArr =[];
        
        recomands.forEach( f => ( f && ( fArr.push( f ) ) ) );
        
        if( !recomands.length ){
            recomands.push( pinghu.cardGray[ ~~( Math.random() * pinghu.cardGray.length ) ] );
        }
        
        console.log( pinghu );
        console.log( recomands );
        
        return recomands;
    }
}

module.exports = Logic;