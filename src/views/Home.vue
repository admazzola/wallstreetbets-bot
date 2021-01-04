<template>
<div>


<Navbar />

<div class="w-full flex flex-wrap w-full my-8 pt-2 bg-gray-800" >
	<div class="hidden pt-6 md:pt-0  md:flex-1 md:order-last">

		<carousel :per-page="1" :autoplay="true" :navigationEnabled="false" :paginationEnabled="false">

			<slide>
						 Slide 1
			</slide>


			<slide>
				 		  	Slide 2
			</slide>

			</carousel>

	</div>
	<div class="w-full p-6 pb-12 md:p-12 md:w-5/12 flex justify-center items-center relative">
		<div class="w-full relative text-center py-12 px-12 md:p-0 md:text-right">



			<div class='text-gray-400'>
				 Api endpoint got: {{ myVariable }}
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


const axios = require('axios');

export default {
  name: 'Home',
  components: {
     Navbar, Carousel, Slide, Footer
  },
  data () {
    return {
      phraseDataArray:  []
    }
  },
  created () {

		this.fetchApiData()


  },
  methods: {
			fetchApiData: async function(){

					console.log('start axios' )

				  let response = await axios.get('/api/v1/wallstreetbets')

					this.myVariable = response.data.apiEndpointName

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
