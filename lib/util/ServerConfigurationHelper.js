
module.exports =  class ServerConfigurationHelper {

  static getServerEnvMode(){
    let mode =  ServerConfigurationHelper.findArgParamStartingWith('--servermode=')

    if(mode == 'production'){
      return 'production'
    }

    if(mode == 'staging'){
      return 'staging'
    }

    return 'development'
  }



  static findArgParamStartingWith(identifier){
    for(var arg of process.argv){

      if(arg.startsWith(identifier)){
        let entireArg = arg;

        let remainderOfArg = entireArg.split('=')[1]

        return remainderOfArg;
      }
    }


  }


}
