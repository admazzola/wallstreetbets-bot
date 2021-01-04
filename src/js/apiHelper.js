



module.exports = class ApiHelper {


  static async getResponseForApiRequest(apiEndpointName, mongoInterface){

      let output;

      if(apiEndpointName == 'wallstreetbets'){
        let latestMongoResult = await ApiHelper.findRecentPhraseDataForSection( apiEndpointName , mongoInterface )

        output = latestMongoResult;
      }
      ///write custom code here

      return {success:true, apiEndpointName: apiEndpointName, outputData: output}
  }

 static async findRecentPhraseDataForSection(sectionName, mongoInterface){

   let recentScanData = await mongoInterface.findOneSorted('scanData', {sectionName: sectionName}, { epoch: -1 } ) //sort descending with -1

   let recentScanIndex = recentScanData.epoch
 
   let popularPhraseResults = await mongoInterface.findAll('popularPhrases', { epoch: recentScanIndex, sectionName: sectionName })

   return {success:true,  popularPhraseResults: popularPhraseResults }
 }



}
