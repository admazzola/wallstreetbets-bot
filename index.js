// pl-scraper.js

const StocksFilter = require('./src/js/StocksFilter')
const WordTokenHelper = require('./src/js/WordTokenHelper')

const fs = require('fs')

const SHA256 = require("crypto-js/sha256");

const delay = require('delay');

const axios = require('axios');
const cheerio = require('cheerio');

const puppeteer = require('puppeteer');

//const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';
const configdata = require('./src/config.js').config;


const MongoInterface = require('./lib/mongo-interface')

const ServerConfigurationHelper = require('./lib/util/ServerConfigurationHelper')

const serverConfig = require('./config/server.config.json')

let mongoInterface = new MongoInterface()


  let serverMode = ServerConfigurationHelper.getServerEnvMode()


async function startCrawl(){


/*
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 100, // slow down by 250ms
    devtools: false
  });*/



     //add this to mongo

     let sectionsToCrawl = configdata.sectionsToCrawl// ['wallstreetbets']

     for(let section of sectionsToCrawl){

       let collectedStrings = [];
       let parsedUrlList = [];

       const [rawCrawlResults, updatedParsedUrlList] = await recursivelyTraverseUrl(  section.baseurl, parsedUrlList  )


       let filteredResults = StocksFilter.filterAllForStockSymbols( rawCrawlResults )

//  let filteredResults = ['TSLA', 'TSLA', 'PLTR']

   let wordTokenDataArray = WordTokenHelper.getWordTokenDataFromRawWordList( filteredResults )


         console.log('finished.' )


         let existingScanData = await mongoInterface.findOneSorted('scanData', {sectionName: section.sectionName }, {epoch: -1})

         console.log('existingScanData.' , existingScanData)

         if(!existingScanData){
           let defaultScanData = {epoch:0 , sectionName: section.sectionName }

           await mongoInterface.insertOne('scanData', defaultScanData)
         }else{
           await mongoInterface.updateCustomAndFindOne('scanData',  { sectionName: section.sectionName }, {$inc: {epoch:  1}}  )
         }

         existingScanData = await mongoInterface.findOneSorted('scanData', {sectionName: section.sectionName }, {epoch: -1})

         console.log('existingScanData',existingScanData)



         for(let wordTokenData of wordTokenDataArray){

           let recentResults = await mongoInterface.insertOne('popularPhrases',
           {sectionName: section.sectionName,
              epoch: existingScanData.epoch,
              wordTokenData: wordTokenData
             } )

         }


        console.log('wordTokenDataArray:', wordTokenDataArray )

     }





}


async function recursivelyTraverseUrl( readableURL, parsedUrlList  ){

  let results = []



    console.log( 'parsing url  ', readableURL  );




   let response = await new Promise((resolve, reject) => {
        axios.get( readableURL ).then(resp => {

          resolve( resp )
      });
  });



  let body = response.data

  //  console.log( 'response is ',body  );

  if(typeof body.data == 'undefined'){
    return [results, parsedUrlList]
  }


  let children = body.data.children

  for(let child of children){

    let childData = child.data

    let permalinkHash = SHA256( childData.permalink  ).toString()
    console.log( 'permalinkHash is ',permalinkHash  );

      if( Object.keys(parsedUrlList).includes( permalinkHash ) ){
        console.log( 'skipping url  ', childData.permalink   );
        return [results, parsedUrlList]
      }else{
        console.log( 'remembering url  ', childData.permalink  , permalinkHash );
        parsedUrlList[ permalinkHash ] =   childData.permalink
      }


    let postTextBody = childData.selftext

     results.push( childData.title )
    results.push(postTextBody)

    let permalink_url = 'https://reddit.com' + childData.permalink + '.json'

    let [childResults, childParsedUrlList] = await recursivelyTraverseUrl( permalink_url , parsedUrlList)
    results = results.concat( childResults )


      console.log('results so far', results  )

    if( childParsedUrlList && childParsedUrlList.length > 0 ){
      console.log( 'childParsedUrlList', childParsedUrlList.length)
        parsedUrlList = parsedUrlList.concat( childParsedUrlList )
    }


    await delay(100)

  }




  return [results, parsedUrlList]
}




async function startBot()
{


  await mongoInterface.init('webscraper_'.concat(serverMode), serverConfig[serverMode].mongoServer)



  let crawlInterval = setInterval(  startCrawl , 12*60*60*1000 )

  startCrawl()

}

    startBot();
