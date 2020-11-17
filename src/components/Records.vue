<template>
<div class="container">
	<h4>Entries from {{ date }} :</h4>
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
		<table class="table" :key="tableChanged">
			<thead class="thead-dark">
				<tr>
					<th scope="col">#</th>
					<th scope="col">Name</th>
					<th scope="col" class="text-center">Paddy</th>
					<th scope="col" class="text-center">Bags</th>
					<th scope="col" class="text-center">Weight</th>
					<th scope="col" class="text-center">Rate</th>
					<th scope="col" class="text-center">Amount</th>
					<th scope="col" class="text-center">Bill?</th>
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
					<td class="text-center" style="color: green">{{ entry.gotBill ? "&#10003;" : ""}}</td> <!-- &#10007; -->
					<td class="text-center">
						<!-- <router-link tag="span" class="btn py-0" :to="'/edit/'+date+'/'+name+'/'+idx+'/'"> -->
						<span class="btn py-0" @click="editEntry(name, idx)">
							<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
							<!-- <img src="https://img.icons8.com/fluent/24/000000/edit.png"/> -->
						<!-- </router-link> -->
						</span>
						<span class="btn py-0" @click="deleteEntry(name, idx)">
							<i class="fa fa-trash-o" aria-hidden="true"></i>
							<!-- <img src="https://img.icons8.com/flat_round/24/000000/delete-sign.png"/> -->
							<!-- <span>&#10060;</span> -->
						</span>
					</td>
				</tr>
				<tr class="bg-light" style="border-bottom:2px solid grey; font-weight: 450;">
					<th scope="row"></th>
					<td style="white-space: nowrap;">{{ titleCase(name) }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ sumOfBags(name) }}</td>
					<td class="text-center">{{ sumOfWeight(name) }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ sumOfAmount(name).toFixed(2) }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ (sumOfAmount(name)*1.005).toFixed(2) }}</td>
				</tr>
			</tbody>
			<tbody>
				<tr style="border-bottom:2px solid grey; font-size: 103%;">
					<th scope="row"></th>
					<td ></td>
					<td class="text-center"></td>
					<td class="text-center">{{ totalBags() }}</td>
					<td class="text-center">{{ totalWeight() }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ totalAmount().toFixed(2) }}</td>
					<td class="text-center"></td>
					<td class="text-center">{{ (totalAmount()*1.005).toFixed(2) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			date: this.$route.params.date,
			records: [],
			isAdmin: true,
			isLoading: true,
			names: [],
			cnti: 0,
			tableChanged: false,
		}
	},
	created() {
		// console.log(this.date);
		axios.get('entries/' + this.date + '.json/').then(res => {
			if (res.data != null) {
				this.records = res.data;
				this.names = Object.keys(this.records);
				this.names.sort();
			}
			this.isLoading = false;
			this.cnti = 0;
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
		sumOfBags(name) {
			let sm = 0;
			Object.values(this.records[name]).forEach(record=>{sm+=record.bags;});
			return sm;
		},
		sumOfWeight(name) {
			let sm = 0;
			Object.values(this.records[name]).forEach(record=>{sm+=record.weight;});
			return sm;
		},
		sumOfAmount(name) {
			let sm = 0;
			Object.values(this.records[name]).forEach(record=>{sm+=record.rate * record.weight;});
			return sm;
		},

		titleCase(str) {
			let splitStr = str.toLowerCase().split(' ');
			for (let i = 0; i < splitStr.length; i++) {
				splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
			}
			return splitStr.join(' '); 
		},

		totalBags() {
			let sm = 0;
			this.names.forEach(name=>{sm+=this.sumOfBags(name);});
			return sm;
		},
		totalWeight() {
			let sm = 0;
			this.names.forEach(name=>{sm+=this.sumOfWeight(name);});
			return sm;
		},
		totalAmount() {
			let sm = 0;
			this.names.forEach(name=>{sm+=this.sumOfAmount(name);});
			return sm;
		},

	}
}
</script>

<style scoped>
	table.table {
		font-size:105%;
		font-family: Verdana;
	}
</style>