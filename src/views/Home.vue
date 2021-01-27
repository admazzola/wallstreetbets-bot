<template>
<div>


<Navbar />

<div class="w-full flex flex-wrap w-full my-8 pt-2 bg-gray-800" >
	<div class=" w-full   ">

		   <nav class="tabs flex flex-col sm:flex-row">

			  <div v-for="section of allSections" @click="focusNewSection(section)" class="tab cursor-pointer text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none  " v-bind:class="{ 'active text-blue-500 border-b-2 font-medium border-blue-500': section == focusSection }">
					{{section}}
				</div>
			</nav>

	</div>

		<div class="w-full relative text-center py-12 px-12 md:p-0 pt-4 ">



			<div class='text-gray-400'>
				 Api endpoint got: {{ apiResponseName }}
			</div>


			<div class="items-center p-6 text-white">
			   <div v-for="item in phraseDataArray">
				 		{{item}}
				 </div>
			</div>
		<!--
			<h1 class="text-2xl mb-4">You abused the gift of Magic.</h1>
			<p class="leading-loose tracking-wide text-gray-700">The Void comes to rid you your planet .</p>
		-->

		</div>

</div>




<Footer />

</div>
</template>


<script>
import Vue from 'vue';
import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);


import { Carousel, Slide } from 'vue-carousel';

import Navbar from './Navbar.vue'

import Footer from './Footer.vue'

const Config = require('../config.js').config


const axios = require('axios');

export default {
  name: 'Home',
  components: {
     Navbar, Carousel, Slide, Footer
  },
  data () {
    return {
			allSections: [],
			focusSection: null,
			apiResponseName: '',
      phraseDataArray:  []
    }
  },
  created () {

		this.allSections = Config.sectionsToCrawl.map( x => x.sectionName )

		this.focusNewSection(this.allSections[0])


  },
  methods: {
		  focusNewSection: function(name){
				console.log(name)

				this.focusSection = name

					this.fetchApiData( this.focusSection )
			},
			fetchApiData: async function( name ){

					console.log('start axios' )

				  let response = await axios.get('/api/v1/'+name)

					this.apiResponseName = response.data.apiEndpointName

					console.log('got response data', response.data )

					this.phraseDataArray = []

					let allPhraseResults = response.data.outputData.popularPhraseResults

					let allWordTokens = allPhraseResults.map(x => x.wordTokenData)

				  allWordTokens.sort(function (a, b) {
						  return b.popularity - a.popularity;
						})

					for(let result of allWordTokens){
						this.phraseDataArray.push( result  )
					}


			}


  }

}
</script>
