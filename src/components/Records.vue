<template>
	<div class="container">
		<h3>Entries from {{ date }} :</h3>
		<hr>

<div v-if="isLoading" class="h5 text-center">Loading..</div>
<div v-else-if="records.length<=0" class="h5 text-center">No Entries found on this date.</div>
		
<table v-else class="table">
	<thead class="thead-dark">
		<tr>
			<th scope="col">#</th>
			<th scope="col">Name</th>
			<th scope="col" class="text-center">Paddy Type</th>
			<th scope="col" class="text-center">Bags</th>
			<th scope="col" class="text-center">Weight</th>
			<th scope="col" class="text-center">Rate</th>
			<th scope="col" class="text-center">Total</th>
			<th scope="col" class="text-center">Got Bill?</th>
			<th v-if="isAdmin" scope="col" class="text-center">Actions</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(record, i) in records" :key="i">
			<th scope="row">{{ i+1 }}</th>
			<td>{{ record.name }}</td>
			<td class="text-center">{{ record.type }}</td>
			<td class="text-center">{{ record.bags }}</td>
			<td class="text-center">{{ record.weight }}</td>
			<td class="text-center">{{ record.rate }}</td>
			<td class="text-center">{{ (record.weight * record.rate * 1.005).toFixed(2) }}</td>
			<td class="text-center" style="color: green">{{ record.gotBill ? "&#10003;" : ""}}</td> <!-- &#10007; -->
			<td class="text-center">
				<router-link tag="span" class="btn py-0" :to="'/edit/'+date+'/'+record.id">
				<!-- <span class="btn py-0" @click="editEntry(i)"> -->
					<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
					<!-- <img src="https://img.icons8.com/fluent/24/000000/edit.png"/> -->
				</router-link>
				<!-- </span> -->
				<span class="btn py-0" @click="deleteEntry(i)">
					<i class="fa fa-trash-o" aria-hidden="true"></i>
					<!-- <img src="https://img.icons8.com/flat_round/24/000000/delete-sign.png"/> -->
					<!-- <span>&#10060;</span> -->
				</span>
			</td>
		</tr>
	</tbody>
</table>

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
			isLoading: true
		}
	},
	created() {
		axios.get('entries/' + this.date + '.json/').then(res => {
			Object.keys(res.data).forEach(key => {
				let record = res.data[key];
				record['id'] = key;
				this.records.push(record);
			});
			// this.records = Object.values(res.data);
			this.isLoading = false;
		}).catch(err => console.error(err));
	},
	methods: {
		editEntry(idx) {
			this.$state.mutations.dispatch('setEditEntry', this.records[idx]);
		},
		deleteEntry(idx) {
			console.log(this.records[idx]);
		}
	}
}
</script>

<style scoped>
</style>