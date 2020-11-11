<template>
	<div class="wrapper">
		<form>
			<div class="form-row">
				<div class="form-group col-md-8 mb-3">
					<label for="name">Name : </label>
					<auto-complete :inputId="'name'" :items="names"></auto-complete>
				</div>
				<div class="form-group col-md-4 mb-3">
					<label for="type">Paddy Type : </label>
					<auto-complete :inputId="'type'" :items="types"></auto-complete>
				</div>
			</div>
			<div class="form-row">
				<div class="col-md-3 mb-3 form-group">
					<label for="bags">Bags : </label>
					<input type="number" class="form-control text-right" 
						id="bags" v-model="bags">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="weight">Weight : </label>
					<input type="number" class="form-control text-right" 
						id="weight" v-model="weight">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="rate">Rate : </label>
					<input type="number" class="form-control text-right" 
						id="rate" v-model="rate">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="rate">Total : </label>
					<input type="number" class="form-control text-right" id="rate" :value="total" disabled>
				</div>
			</div>
			<div class="form-row justify-content-end mt-3">
				<!-- <div class="col-md-9 form-group">
					<label for="notes">Notes:</label>
					<textarea class="form-control" id="notes" rows="3"></textarea>
				</div> -->
				<div class="col-md-auto form-group">
					<div class="custom-control custom-checkbox">
						<input type="checkbox" class="custom-control-input" id="gotBill">
						<label class="custom-control-label" for="gotBill">Bill received ? </label>
					</div>
				</div>
				<div class="col-md-auto my-auto form-group">
					<button class="btn btn-light border px-3">Add</button>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
	import AutoComplete from './AutoComplete.vue';
	export default {
		components: {
			AutoComplete
		},
		data() {
			return {
				names: ['Alpha', 'Beta', 'Charlie', 'Delta', 'Elephant'],
				types: ['Dabra', 'Jira', 'Kolam', 'Parimal', 'Guj-17', 'Gujari', 'Basmati', 'Black Paddy'],

				bags: 0,
				weight: 0,
				rate: 0.0
			};
		},
		computed: {
			total() {
				return (this.weight * this.rate * 1.005).toFixed(2);
			}
		}
	};
</script>

<style scoped>

	div.wrapper, 
	input[type=number], 
	input[type=text], 
	/*label, */
	button {
		font-size: 120%;
	}

	/*input[type="checkbox"]{
		cursor: pointer;
		-webkit-appearance: none;
		appearance: none;
		background: #34495E;
		box-sizing: border-box;
		position: relative;
		box-sizing: content-box ;
		width: 30px;
		height: 30px;
		border: 2px solid black;
		border-radius: 10px;
		transition: all .3s linear;
	}
	input[type="checkbox"]:checked{
		background-color: #2ECC71;
	}
	input[type="checkbox"]:focus{
		outline: 0 none;
		box-shadow: none;
	}*/	

	label:not(.custom-control-label) {
		color: #777;
	}
	.custom-control-label {
		font-size: 120%;
		vertical-align: top;
	}

	input[type=number]::-webkit-inner-spin-button, 
	input[type=number]::-webkit-outer-spin-button { 
		-webkit-appearance: none;
		appearance: none;
		margin: 0; 
	}
	input[type=number] {
		-moz-appearance: textfield;
	}

	/*.form-group, input, label {
		z-index: 10;
	}*/
</style>