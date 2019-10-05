
const Defined = require('./defined');

const arrayMove = require('array-move');

class Shuffle{
    constructor(){
        this.cards = [];
    }
    
    newShuffle( parmas ){
        let self = this,
            newArr = [],
            ranLen = parmas.ranLen || 20;
        
        for( let i = 0; i < 4; i++ ){
            Defined.Types.forEach( ( card ) => {
                self.cards.push( card );
            } );
        }
        
        for( let i = 0; i < ranLen; i++ ){
            self.cards.sort( (a, b) => ( Math.random() > .5 ) ? true : false );
        }
        
        if( parmas.constCard && (!isNaN( parmas.chair )) ){
            
            // prepear sort card to back
            
            parmas.constCard.forEach( ( card ) => {
                
                let cAt = self.cards.indexOf(card);
                
                self.cards = arrayMove( self.cards, cAt, self.cards.length );
                
            } );
            
            
            for( let i = 13 * parmas.chair; i < 13 * (parmas.chair+1); i++ ){
                
                let chartAt = self.cards.lastIndexOf( parmas.constCard[ i ] );
                
                self.cards = arrayMove( self.cards, chartAt, i );
            }
        }
        
        return this.cards;
    }
    
}

module.exports = Shuffle;