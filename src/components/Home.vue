<template>
<div class="row"><div class="col">
	<div class="wrapper">
		<div class="form">
			<div class="form-row">
				<div class="form-group col-md-8 mb-3">
					<label for="name">Name : </label>
					<auto-complete inputId="name" :items="Object.keys(names)" @input="name=$event"></auto-complete>
				</div>
				<div class="form-group col-md-4 mb-3">
					<label for="type">Paddy Type : </label>
					<auto-complete inputId="type" :items="types" @input="type=$event"></auto-complete>
				</div>
			</div>
			<div class="form-row">
				<div class="col-md-3 mb-3 form-group">
					<label for="bags">Bags : </label>
					<input type="number" class="form-control text-right" 
						id="bags" v-model="bags" @focus="$event.target.select()">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="weight">Weight : </label>
					<input type="number" class="form-control text-right" 
						id="weight" v-model="weight" @focus="$event.target.select()">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="rate">Rate : </label>
					<input type="number" class="form-control text-right" 
						id="rate" v-model="rate" @focus="$event.target.select()">
				</div>
				<div class="col-md-3 mb-3 form-group">
					<label for="rate">Total : </label>
					<input type="number" class="form-control text-right" id="rate" :value="total" disabled>
				</div>
			</div>
			<div class="form-row justify-content-md-between">
				<!-- <div class="col-md-9 form-group">
					<label for="notes">Notes:</label>
					<textarea class="form-control" id="notes" rows="3"></textarea>
				</div> -->
				<div class="col-md-3 mb-3 form-group">
					<label for="date">Date: </label>
					<input type="date" class="form-control" 
						id="date" v-model="date">
				</div>
				<!-- <div class="col-md-auto mb-3 form-group pt-2 d-flex justify-content-center">
					<label class="checkbox">
						<input type="checkbox" id="gotBill"	 v-model="gotBill" />
						<span class="default"></span>
					</label>
					<label for="gotBill" class="ls-5 px-2">Bill Received ?</label>
				</div> -->
				<div class="col-md-auto mb-3 form-group d-flex justify-content-center align-items-end">
					<button class="btn btn-light border px-3" @click="saveEntry">Add</button>
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
				names: [],
				types: ['Basmati', 'Black Paddy', 'Dabra', 'Guj-17', 'Gujari', 'Jira', 'Kolam', 'Mamra', 'Parimal'], // this.$store.state.paddyTypes,

				name: '',
				type: '',
				bags: 0,
				weight: 0,
				rate: 0.0,
				gotBill: false,

				date: ''
			};
		},
		created() {
			let date = new Date();
			this.date = date.getFullYear().toString() + '-'
				 + (date.getMonth() + 1).toString().padStart(2, 0) + '-'
				 + date.getDate().toString().padStart(2, 0);
				
			axios.get('names.json/')
				.then(res => {
					if (res.data != null) {
						this.names = res.data;
					}
				}).catch(err => console.error(err));
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

			saveEntry() {
				if (!this.validEntry()) {
					return;
				}
				this.name = this.name.toLowerCase();
				if (this.names[this.name] == undefined) {
					this.names[this.name] = 0;
				}
				axios.put('names/'+this.name+'.json/?print=silent', ++this.names[this.name])
					.then(()=>{})
					.catch(err => console.error(err));
				axios.post('entries/'+this.date+'/'+this.name+'.json/?print=silent', {
					type: this.type,
					bags: parseInt(this.bags),
					weight: parseFloat(this.weight),
					rate: parseFloat(this.rate),
					gotBill: this.gotBill,
				}).then(res => {
					this.bags = this.weight = this.rate = 0
					this.gotBill = false
				}).catch(err => console.error(err));
			},

			titleCase(str) {
				let splitStr = str.toLowerCase().split(' ');
				for (let i = 0; i < splitStr.length; i++) {
					splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
				}
				return splitStr.join(' '); 
			},

		}
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

	label {
		color: #777;
		/*letter-spacing: 0.5px;*/
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

	.ls-5 {
		letter-spacing: 0.5px;
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