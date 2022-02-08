const binance = require('./binance.js');

/*

<--- Wolf.js --->

const Symbol = require('./Symbol.js');

init() {
    const symbolConfig = {
        tradingPair: this.config.tradingPair,
    };
    const symbol = new Symbol(symbolConfig);
    this.symbol = await ticker.init();
    console.log(this.symbol.meta.minPrice);
}

*/

module.exports = class Symbol {
    constructor(config) {
        this.tradingPair = config.tradingPair;
        this.meta = {};
    }

    async init() {
        try {
            const exchangeInfo = await binance.exchangeInfo();
            exchangeInfo.symbols.forEach((symbol) => {
                if (symbol.symbol === this.tradingPair) {
                    return this.meta = Object.assign(this.getters(), symbol);
                }
            });
            return true;
        } catch(err) {
            console.log('SYMBOL ERROR: ', err.message);
            return false;
        }
    }

    getters() {
        const gf = (scope, field) => scope.filters.find(filter => field in filter)[field];

        return {
            get minPrice() { return Number(gf(this, 'minPrice')) },
            get maxPrice() { return Number(gf(this, 'maxPrice')) },
            get tickSize() { return Number(gf(this, 'tickSize')) },
            get minQty() { return Number(gf(this, 'minQty')) },
            get maxQty() { return Number(gf(this, 'maxQty')) },
            get stepSize() { return Number(gf(this, 'stepSize')) },
            get priceSigFig() { return Number(gf(this, 'tickSize').indexOf('1') - 1) },
            get quantitySigFig() {
                const sf = Number(gf(this, 'stepSize').indexOf('1') - 1);
                return sf >= 0 ? sf : 0;
            }
        }
    }
};
