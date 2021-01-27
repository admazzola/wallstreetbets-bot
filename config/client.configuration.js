module.exports = {





  getEnvironment(){

    console.log('env is ' , process.env.NODE_ENV )
    let env = process.env.NODE_ENV // this.findArgParamStartingWith('--clientmode=')

    if(env=='staging'){
      return 'staging'
    }

    if(env=='production'){
      return 'production'
    }

    console.log('client env is ', env )

    return 'development'


  }

}
