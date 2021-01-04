const checkWord = require('check-word')
var wordChecker     = checkWord('en')

const customWords = ['tendies','www','reddit','com','wallstreetbets','sr','wsb','dd','shitposting','usd','https','png','webp']

module.exports = class StocksFilter {

    static filterAllForStockSymbols(rawStringsArray){


      let outputPhrases = [];

      for (let str of rawStringsArray){

        let filteredTokens = StocksFilter.filterPhraseForStockSymbols(str)

        for(let token of filteredTokens){
            outputPhrases.push(token)
        }


      }

      return outputPhrases

    }

    static filterPhraseForStockSymbols(inputPhrase){

      let inputPhraseAlphanumeric = inputPhrase.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ");

      let wordTokens = inputPhraseAlphanumeric.replace(/\s+/g, ' ').trim().split(' ')


      let filteredTokens = []

      for(let token of wordTokens){
        let isValidWord = ( wordChecker.check( token.toLowerCase() ) ||  customWords.includes(token) )

        if(!isValidWord && token.length >= 2 &&   isNaN(parseInt(token))){
          filteredTokens.push(token)
        }
      }

      return filteredTokens

    }

}
