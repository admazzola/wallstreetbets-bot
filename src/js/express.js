const express = require('express');
const app = express();
const port = 3000;

const ApiHelper = require('./apiHelper')


const MongoInterface = require('../../lib/mongo-interface')


const ServerConfigurationHelper = require('../../lib/util/ServerConfigurationHelper')

const serverConfig = require('../../config/server.config.json')

let mongoInterface = new MongoInterface()


  let serverMode = ServerConfigurationHelper.getServerEnvMode()


 mongoInterface.init('adventure_'.concat(serverMode), serverConfig[serverMode].mongoServer)


app.use(express.static('dist'))
app.get('/', (req, res) => {
    res.sendFile('./dist/index.html', { root: __dirname });
});



app.get('/api/v1/:apiEndpointName', async (req, res) => {

    let apiEndpointName = req.params.apiEndpointName

    console.log('api output')




    let apiReponse = await ApiHelper.getResponseForApiRequest( apiEndpointName, mongoInterface )


    res.send( apiReponse )



});

app.listen(port, () => console.log(`listening on port ${port}!`));
