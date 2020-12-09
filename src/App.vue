<template>
	<div id="app" class="container">
		<app-header v-if="!printMode"></app-header>
		<!-- <h1 class="heading mt-4">Entry</h1> -->
		<!-- <hr> -->
		
		<!-- <div class="container"> -->
			<router-view :key="$route.fullPath"></router-view>
		<!-- </div> -->
	</div>
</template>

<script>
	import Header from './components/Header.vue';

	export default {
		name: 'App',
		components: {
			appHeader: Header
		},
		created() {
			this.$store.dispatch('getNames');
		},
		computed: {
			printMode() {
				return this.$store.state.printMode;
			}
		}
	};
</script>

<style>
</style>
