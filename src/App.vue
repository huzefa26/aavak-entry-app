<template>
	<div id="app" class="container">
		<app-header></app-header>
		<!-- <h1 class="heading mt-4">Entry</h1> -->
		<!-- <hr> -->
		<div class="row">
			<div class="col">
				<app-form></app-form>
				<!-- <auto-complete :items="names"></auto-complete> -->
			</div>
		</div>
	</div>
</template>

<script>
	import AutoComplete from './components/AutoComplete.vue';
	import Form from './components/Form.vue';
	import Header from './components/Header.vue';

	export default {
		name: 'App',
		components: {
			AutoComplete,
			appForm: Form,
			appHeader: Header
		},
		data() {
			return {
				names: [
					'Apple',
					'Namna',
					'Chetty',
					'Dadum'
				],
				value: ''
			}
		}
	};
</script>

<style>
</style>
