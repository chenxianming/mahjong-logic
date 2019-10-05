module.exports = () => {
    Array.prototype.clear = function () {
        this.length = 0;
        return this;
    };
    
    Array.prototype.removeAt = function (index) {
        this.splice(index, 1);
        return this;
    };

    Array.prototype.clone = function (array) {
        let nArr = [];
        
        array.forEach( ( a ) => {
            nArr.push( a );
        } );
        
        return nArr;
    };

    Array.prototype.repeat = function( v ){
        
        let repeatLen = -1;
        
        this.forEach( function( b ){
            
            if( v == b ){
                repeatLen++;
            }
            
        } );
        
        return repeatLen;
    }
}