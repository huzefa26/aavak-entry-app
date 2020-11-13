<template>
<div class="row"><div class="col">
	<div class="wrapper">
		<div class="form">
			<div class="form-row">
				<div class="form-group col-md-8 mb-3">
					<label for="name">Name : </label>
					<auto-complete :inputId="'name'" :items="names" @input="name=$event"></auto-complete>
				</div>
				<div class="form-group col-md-4 mb-3">
					<label for="type">Paddy Type : </label>
					<auto-complete :inputId="'type'" :items="types" @input="type=$event"></auto-complete>
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
					<input type="number" step="0.01" class="form-control text-right" 
						id="weight" v-model="weight">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="rate">Rate : </label>
					<input type="number" step="0.01" class="form-control text-right" 
						id="rate" v-model="rate">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="rate">Total : </label>
					<input type="number" class="form-control text-right" id="rate" :value="total" disabled>
				</div>
			</div>
			<div class="form-row justify-content-end mt-3">
				<div class="col-md-auto form-group">
					<div class="custom-control custom-checkbox">
						<input type="checkbox" class="custom-control-input" id="gotBill" v-model="gotBill">
						<label class="custom-control-label" for="gotBill">Bill received ? </label>
					</div>
				</div>
				<div class="col-md-auto my-auto form-group">
					<button class="btn btn-light border px-3" @click="updateEntry">Add</button>
				</div>
			</div>
		</div>
	</div>
</div></div>
</template>

<script>
	import AutoComplete from './AutoComplete.vue';
	import axios from 'axios';

	export default {
		components: {
			AutoComplete
		},
		data() {
			return {
				id: this.$route.params.id,
				date: this.$route.params.date,
				names: [],
				types: this.$store.state.paddyTypes,

				name: '',
				type: '',
				bags: 0,
				weight: 0,
				rate: 0.0,
				gotBill: false,
			};
		},
		created() {
			console.log(this.id);
			// this.id = 'huzefa'
			axios.get('entries/'+this.date+'.json?orderBy="$key"&equalTo="'+this.id+'"')
			.then(res => {
				if (res.data != null) {
					let data = res.data[this.id];
					document.getElementById('name').value = data['name'];
					document.getElementById('type').value = data['type'];
					this.bags = data['bags'];
					this.weight = data['weight'];
					this.rate = data['rate'];
					this.gotBill = data['gotBill'];
				}
			}).catch(err => console.log(err));
			axios.get('names.json/')
			.then(res => {
				if (res.data != null) {
					let names = Object.values(res.data);
					names.forEach(name => {
						this.names.push(name[0]);
					});
				}
			}).catch(err => console.error(err));
		},
		computed: {
			total() {
				return (this.weight * this.rate * 1.005).toFixed(2);
			}
		},
		methods: {
			updateEntry() {
				if (!this.names.includes(this.name)) {
					// delete current name if there are no other entries of it
					let newName = {0: this.name};
					axios.post('names.json/', newName)
					.then(res => {
						console.log(res);
					}).catch(err => console.log(err));
					this.names.push(this.name);
				}
				let data = {
					// id: Date.now(), step="0.01"
					name: this.name,
					type: this.type,
					bags: parseInt(this.bags),
					weight: parseFloat(this.weight),
					rate: parseFloat(this.rate),
					gotBill: this.gotBill,
				};
				// console.log(data);
				axios.put('entries/'+this.date+'.json?orderBy="$key"&equalTo="'+this.id+'"', data)
				.then(res => {
					console.log(res);
					// this.$router.push('/records/' + this.date + '/');
				})
				.catch(err => console.error(err));
			}
		}
	};
</script>

<style scoped>

	div.wrapper, 
	input[type=number], 
	input[type=text], 
	button {
		font-size: 120%;
	}

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
</style>