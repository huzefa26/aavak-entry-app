<template>
<div class="row"><div class="col">
	<div class="wrapper">
		<h3 v-if="noEditEntry" class="text-center">You need to select an entry from the records.</h3>
		<div v-else class="form">
			<div class="form-row">
				<div class="form-group col-md-8 mb-3">
					<label for="name">Name : </label>
					<auto-complete inputId="name" :items="Object.keys(names)" @input="name=$event" :value="name"></auto-complete>
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
			<div class="form-row justify-content-end mt-3">
				<div class="col-md-auto mb-3 form-group pt-2 d-flex justify-content-center">
					<label class="checkbox">
						<input type="checkbox" id="gotBill" v-model="gotBill" />
						<span class="default"></span>
					</label>
					<label for="gotBill" class="ls-5 px-2">Bill Received ?</label>
				</div>
				<div class="col-md-auto my-auto form-group">
					<button class="btn btn-light border px-3" @click="updateEntry">Update</button>
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
				names: [],
				types: ['Dabra', 'Jira', 'Kolam', 'Parimal', 'Guj-17', 'Gujari', 'Basmati', 'Black Paddy'], // this.$store.state.paddyTypes,

				prevName: '',
				type: '',
				bags: 0,
				weight: 0,
				rate: 0.0,
				gotBill: false,
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

			axios.get('names.json/')
			.then(res => {
				if (res.data != null) {
					this.names = res.data;
				}
			}).catch(err => console.error(err));

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
				let name = this.name.toLowerCase();
				if (name != this.prevName) {
					if (this.names[name] == undefined) {
						// add new name
						let newName = JSON.parse("{'"+name+"' : 1}");
						axios.post('names.json/?print=silent', newName)
							.then(() => {}).catch(err => console.log(err));
						this.names.push(name);
					} else {
						// increase count
						axios.get('names/'+name+'.json/')
							.then(res => {
								let cnt = res.data + 1;
								axios.put('names/'+name+'.json/?print=silent', cnt)
									.then(() => {}).catch(err => console.error(err));
							}).catch(err => console.error(err));
					}

					// delete prev name if there are no other entries of it
					axios.delete('entries/'+this.date+'/'+this.prevName+'/'+this.id+'.json/?print=silent')
						.then(() => {}).catch(err => console.error(err));

					axios.get('names/'+this.prevName+'.json/')
						.then(res => {
							let cnt = res.data;
							if (cnt == null || cnt == 0) {
							} else if (cnt == 1) {
								axios.delete('names/'+this.prevName+'.json/?print=silent')
									.then(() => {}).catch(err => console.error(err));
							} else {
								axios.put('names/'+this.prevName+'.json/?print=silent', cnt)
									.then(() => {}).catch(err => console.error(err));
							}
						}).catch(err => console.error(err));
				}
				let data = {
					type: this.type,
					bags: parseInt(this.bags),
					weight: parseFloat(this.weight),
					rate: parseFloat(this.rate),
					gotBill: this.gotBill,
				};
				axios.put('entries/'+this.date+'/'+name+'/'+this.id+'.json/?print=silent', data)
					.then(res => {
						// console.log(res);
						this.$router.push('/records/' + this.date + '/');
					})
					.catch(err => console.error(err));
			},

			titleCase(str) {
				let splitStr = str.toLowerCase().split(' ');
				for (let i = 0; i < splitStr.length; i++) {
					splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
				}
				return splitStr.join(' '); 
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