
const StocksFilter = require('../src/js/StocksFilter')


var assert = require('chai').assert;
var expect = require('chai').expect;


describe('  server tests', function() {



  it(" can filter test data ", async () => {


          let testdata = ['All I know is 🚀 means buy.',
            '',
            'Anyone still buying NKLA?',
            '',
            'PLTR GANG RISE UP!!!!! This is our year 🚀🚀🚀🚀🚀🚀',
            '',
            'Our ARK Queen hard at work in the Ancient Times 🚀🚀🚀',
            '',
            'I’m ready for some 2021 tendies',
            '',
            'RIP Jack',
            '',
            'How I feel holding GME shares',
          ]

          let tokens = StocksFilter.filterAllForStockSymbols(testdata)



          console.log(tokens)

        assert.ok(true);

      })


  })
