<template>
	<div id="app" class="container">
		<app-header></app-header>
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
		}
	};
</script>

<style>
</style>
