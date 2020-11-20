<template>
<div class="container">
	<h4>Entries from {{ showDate }} :</h4>
	<hr>

	<div v-if="isLoading" class="h5 text-center mt-3">
		<div class="d-flex justify-content-center">
			<div class="spinner-border" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		</div>
	</div>
	
	<div v-else-if="records.length<=0" class="h5 text-center">
		<div class="alert alert-warning" role="alert">
			No Entries found on this date!
		</div>
	</div>

	<div v-else class="table-responsive">
		<table class="table mb-5" :key="tableChanged">

			<thead class="thead-dark">
				<tr>
					<th scope="col">#</th>
					<th scope="col">Name</th>
					<th scope="col" class="text-center">Paddy</th>
					<th scope="col" class="text-center">Bags</th>
					<th scope="col" class="text-center">Weight</th>
					<th scope="col" class="text-center">Rate</th>
					<th scope="col" class="text-center">Price</th>
					<!-- <th scope="col" class="text-center">Bill?</th> -->
					<th v-if="isAdmin" scope="col" class="text-center">Actions</th>
				</tr>
			</thead>

			<tbody v-for="(name, ni) in names" :key="ni">
				<tr v-for="(entry, idx) in records[name]" :key="idx" class="text-muted">
					<th scope="row"><!-- {{ ni+1 }}.{{ countSNo() }} --></th>
					<td width="20%" ><!-- {{ i==0 ? titleCase(name) : "" }} --></td>
					<td class="text-center">{{ entry.type }}</td>
					<td class="text-center">{{ entry.bags }}</td>
					<td class="text-center">{{ entry.weight }}</td>
					<td class="text-center">{{ entry.rate }}</td>
					<td class="text-center">{{ (entry.weight * entry.rate).toFixed(2) }}</td>
					<!-- <td class="text-center" style="color: green">{{ entry.gotBill ? "&#10003;" : ""}}</td> --> <!-- &#10007; -->
					<td class="text-center">
						<span class="btn py-0" @click="editEntry(name, idx)">
							<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
						</span>
						<span class="btn py-0" @click="deleteEntry(name, idx)">
							<i class="fa fa-trash-o" aria-hidden="true"></i>
						</span>
					</td>
				</tr>

				<tr class="bg-light" style="border-bottom:2px solid grey; font-weight: 450;">
					<th scope="row"></th>
					<td style="white-space: nowrap;">{{ titleCase(name) }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ nameStats[name].bags }}</td>
					<td class="text-center">{{ nameStats[name].weight }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ nameStats[name].price.toFixed(2) }}</td>
					<!-- <td class="text-center"></td> -->
					<td class="text-center">{{ (nameStats[name].price*1.005).toFixed(2) }}</td>
				</tr>
			</tbody>

			<tbody>
				<tr style="border-bottom:2px solid grey; font-size: 103%;">
					<th scope="row"></th>
					<td ></td>
					<td class="text-center"></td>
					<td class="text-center">{{ dayStats.bags }}</td>
					<td class="text-center">{{ dayStats.weight }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ dayStats.price.toFixed(2) }}</td>
					<!-- <td class="text-center"></td> -->
					<td class="text-center">{{ (dayStats.price*1.005).toFixed(2) }}</td>
				</tr>
			</tbody>

		</table>

		<report :stats="typeStats"></report>

	</div>
</div>
</template>

<script>
import axios from 'axios';
import Report from './Report';

export default {
	components: {
		Report
	},
	data() {
		return {
			date: this.$route.params.date,
			records: [],
			isAdmin: true,
			isLoading: true,
			names: [],
			cnti: 0,
			tableChanged: false,
			showDate: '',
			nameStats: {},
			typeStats: {},
			dayStats: {},
		}
	},
	created() {
		this.showDate = (new Date(this.date)).toLocaleDateString(
			[], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
		);
		this.dayStats = {'bags': 0, 'weight': 0, 'price': 0};

		axios.get('entries/' + this.date + '.json/').then(res => {
			if (res.data != null) {
				this.records = res.data;
				this.names = Object.keys(this.records);
				this.names.sort();
				this.cnti = 0;
			
				// get all sums
				this.names.forEach(name => {
					this.nameStats[name] = {'bags': 0, 'weight': 0, 'price': 0};
					Object.values(this.records[name]).forEach(entry => {
						this.dayStats.bags += entry.bags;
						this.dayStats.weight += entry.weight;
						this.dayStats.price += entry.weight * entry.rate;

						this.nameStats[name].bags += entry.bags;
						this.nameStats[name].weight += entry.weight;
						this.nameStats[name].price += entry.weight * entry.rate;

						if (this.typeStats[entry.type] == undefined) {
							this.typeStats[entry.type] = {'bags': 0, 'weight': 0, 'price': 0};
						}
						this.typeStats[entry.type].bags += entry.bags;
						this.typeStats[entry.type].weight += entry.weight;
						this.typeStats[entry.type].price += entry.weight * entry.rate;
						// this.typeStats[type].avgRate += ; // build logic
					});
				});
			}
			this.isLoading = false;
		}).catch(err => console.error(err));
	},
	methods: {
		// countSNo() {
		// 	if (this.isLoading) return 0;
		// 	return ++this.cnti;
		// },

		editEntry(name, id) {
			let toEdit = this.records[name][id];
			toEdit.date = this.date;
			toEdit.name = name;
			toEdit.id = id
			this.$store.commit('setEditEntry', toEdit);
			this.$router.push('/edit');
		},

		deleteEntry(name, id) {
			
			axios.delete('entries/'+this.date+'/'+name+'/'+id+'.json/?print=silent')
				.then(res => {
					delete this.records[name][id];
					this.tableChanged ^= true;
					// this.$router.push('/records/' + this.date + '/');
				})
				.catch(err => console.error(err));

			// decrement names.json count
			axios.get('names/'+name+'.json/')
				.then(res => {
					let cnt = res.data;
					if (cnt == null) {
						//
					} else if (--cnt > 0) {
						axios.put('names/'+name+'.json/?print=silent', cnt)
							.then(() => {}).catch(err => console.error(err));
					} else {
						axios.delete('names/'+name+'.json/?print=silent')
							.then(() => {}).catch(err => console.error(err));
					}
				}).catch(err => console.error(err));
		},

		// sumOfBags(name) {
		// 	let sm = 0;
		// 	Object.values(this.records[name]).forEach(record=>{sm+=record.bags;});
		// 	return sm;
		// },
		// sumOfWeight(name) {
		// 	let sm = 0;
		// 	Object.values(this.records[name]).forEach(record=>{sm+=record.weight;});
		// 	return sm;
		// },
		// sumOfPrice(name) {
		// 	let sm = 0;
		// 	Object.values(this.records[name]).forEach(record=>{sm+=record.rate * record.weight;});
		// 	return sm;
		// },

		titleCase(str) {
			let splitStr = str.toLowerCase().split(' ');
			for (let i = 0; i < splitStr.length; i++) {
				splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
			}
			return splitStr.join(' '); 
		},

		// totalBags() {
		// 	let sm = 0;
		// 	this.names.forEach(name=>{sm+=this.sumOfBags(name);});
		// 	return sm;
		// },
		// totalWeight() {
		// 	let sm = 0;
		// 	this.names.forEach(name=>{sm+=this.sumOfWeight(name);});
		// 	return sm;
		// },
		// totalPrice() {
		// 	let sm = 0;
		// 	this.names.forEach(name=>{sm+=this.sumOfPrice(name);});
		// 	return sm;
		// },

	}
}
</script>

<style scoped>
	table.table {
		font-size:105%;
		font-family: Verdana;
		/*margin-bottom: 5px;*/
	}
</style>