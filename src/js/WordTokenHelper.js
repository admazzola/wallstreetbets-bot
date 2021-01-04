
module.exports = class WordTokenHelper {

    static getWordTokenDataFromRawWordList(wordList){

      let existingWordTokens = []
      let wordTokenDataArray = []

      for(let word of wordList){

        if(existingWordTokens.includes(word)){
          continue;
        }

        let timesCounted = 0;

        for(let existingWord of wordList){
          if(existingWord.toLowerCase() == word.toLowerCase()){
            timesCounted = timesCounted + 1;
          }
        }

        wordTokenDataArray.push({
          rawString: word,
          popularity: timesCounted
        })


        existingWordTokens.push(word)

      }


      return wordTokenDataArray

    }



}
