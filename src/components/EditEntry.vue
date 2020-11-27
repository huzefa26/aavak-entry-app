<template>
<div class="row"><div class="col">
	<div class="wrapper">
		<h3 v-if="noEditEntry" class="text-center">You need to select an entry from the records.</h3>
		<div v-else class="form">
			<div class="form-row">
				<div class="form-group col-md-8 mb-3">
					<label for="name">Name : </label>
					<auto-complete inputId="name" :items="names" @input="name=$event" :value="name"></auto-complete>
				</div>
				<div class="form-group col-md-4 mb-3">
					<label for="type">Paddy Type : </label>
					<auto-complete inputId="type" :items="types" @input="type=$event" :value="type"></auto-complete>
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
			<div class="form-row justify-content-md-between">
				<div class="col-md-3 mb-3 form-group">
					<label for="date">Date: </label>
					<input type="date" class="form-control" 
						id="date" v-model="date">
				</div>
				<!-- <div class="col-md-auto mb-3 form-group pt-2 d-flex justify-content-center">
					<label class="checkbox">
						<input type="checkbox" id="gotBill" v-model="gotBill" />
						<span class="default"></span>
					</label>
					<label for="gotBill" class="ls-5 px-2">Bill Received ?</label>
				</div> -->
				<div class="col-md-auto mb-3 form-group d-flex justify-content-center align-items-end">
					<button class="btn btn-light border px-3" @click="updateEntry" :disabled="isUpdating">
						{{ isUpdating ? "Updating" : "Update" }}
					</button>
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
				noEditEntry: false,
				id: null, //this.$route.params.id,
				date: null, //this.$route.params.date,
				name: null, //this.$route.params.name,
				names: Object.keys(this.$store.state.names),
				types: this.$store.state.paddyTypes,

				prevName: '',
				prevDate: '',
				type: '',
				bags: 0,
				weight: 0,
				rate: 0.0,
				gotBill: false,
				isUpdating: false,
			};
		},
		created() {

			let data = this.$store.state.editEntry;
			if (data == null) {
				this.noEditEntry = true;
				return;
			}
			
			this.id = data['id']
			this.name = data['name'];
			this.date = data['date'];
			this.type = data['type'];
			this.bags = data['bags'];
			this.weight = data['weight'];
			this.rate = data['rate'];
			this.gotBill = data['gotBill'];

			this.prevName = this.name;
			this.prevDate = this.date;

			// axios.get('entries/'+this.date+'/'+this.name+'/'+this.id+'.json/')
			// .then(res => {
			// 	if (res.data != null) {
			// 		let data = res.data;
			// 		// document.getElementById('name').value = this.titleCase(this.name);
			// 		document.getElementById('type').value = data['type'];
			// 		this.bags = data['bags'];
			// 		this.weight = data['weight'];
			// 		this.rate = data['rate'];
			// 		this.gotBill = data['gotBill'];
			// 	}
			// }).catch(err => console.log(err));

		},
		computed: {
			total() {
				return (this.weight * this.rate/* * 1.005*/).toFixed(2);
			}
		},
		methods: {

			validEntry() {
				if (this.name.trim() == '') return false;
				if (this.type.trim() == '') return false;
				if (this.bags == 0) return false;
				if (this.total == 0) return false;
				return true;
			},

			updateEntry() {
				if (!this.validEntry()) {
					// Notify about this
					// console.log("Bad entry")
					return;
				}
				this.isUpdating = true;
				let name = this.name.toLowerCase();

				if (name != this.prevName) {
					this.$store.dispatch('increaseNameCount', name);
				}

				let data = {
					type: this.type,
					bags: parseInt(this.bags),
					weight: parseFloat(this.weight),
					rate: parseFloat(this.rate),
					// gotBill: this.gotBill,
				};

				axios.delete('entries/'+this.prevDate+'/'+this.prevName+'/'+this.id+'.json/?print=silent')
					.then(() => {
						axios.put('entries/'+this.date+'/'+name+'/'+this.id+'.json/?print=silent', data)
							.then(() => {
								if (name != this.prevName) {
									// delete prev name if there are no other entries of it
									this.$store.dispatch('decreaseNameCount', this.prevName);
								}
								this.isUpdating = false;
								this.$router.push('/records/' + this.date + '/');
							})
							.catch(err => console.error(err));
					})
					.catch(err => console.error(err));
			},
		},

		beforeRouteLeave (to, from, next) {
			// const answer = window.confirm('Do you really want to leave? You have unsaved changes!')
			// if (answer) {
				this.$store.commit('unsetEditEntry');
				next()
			// } else {
			// 	next(false)
			// }
		},

	};
</script>

<style scoped>

	div.wrapper, 
	input[type=number], 
	input[type=text], 
	input[type=date], 
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


	@keyframes check {
		0% {height: 0;width: 0;}
		25% {height: 0;width: 10px;}
		50% {height: 20px;width: 10px;}
	}
	.checkbox {
		background-color:#fff;
		display:inline-block;
		width:25px; /*28px;*/
		height:25px; /*28px*/
		margin: .25em; /*0 .25em;*/
		border-radius:4px;
		border:1px solid #ccc;
		float:right
	}
	.checkbox span{display:block;height:28px;position:relative;width:28px;padding:0}
	.checkbox span:after{
		-moz-transform:scaleX(-1) rotate(135deg);
		-ms-transform:scaleX(-1) rotate(135deg);
		-webkit-transform:scaleX(-1) rotate(135deg);
		transform:scaleX(-1) rotate(135deg);
		-moz-transform-origin:left top;
		-ms-transform-origin:left top;
		-webkit-transform-origin:left top;
		transform-origin:left top;
		border-right:4px solid #fff;
		border-top:4px solid #fff;
		content:'';
		display:block;
		height:18px; /*20px;*/
		width:9px; /*10px;*/
		left:2.7px; /*3px;*/
		position:absolute;
		top:13px; /*15px;*/
	}
	.checkbox span:hover:after{border-color:#999}
	.checkbox input{display:none}
	.checkbox input:checked + span:after{
		-webkit-animation:check .8s;
		-moz-animation:check .8s;
		-o-animation:check .8s;
		animation:check .8s;
		border-color:#555;
	}
	.checkbox input:checked + .default:after{border-color:#444}
	.checkbox input:checked + .primary:after{border-color:#2196F3}
	.checkbox input:checked + .success:after{border-color:#8bc34a}
	.checkbox input:checked + .info:after{border-color:#3de0f5}
	.checkbox input:checked + .warning:after{border-color:#FFC107}
	.checkbox input:checked + .danger:after{border-color:#f44336}

</style>