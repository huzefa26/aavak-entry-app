<template>
	<div class="container">
		<h3>Entries from {{ date }} :</h3>
		<hr>
		
<table class="table">
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
			<td class="text-center">{{ record.gotBill ? "&#10003;" : ""}}</td> <!-- &#10007; -->
			<td class="text-center"><span></span><span></span></td>
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
			isAdmin: true
		}
	},
	created() {
		axios.get('entries/' + this.date + '.json/').then(res => {
			this.records = Object.values(res.data);
			// Object.values(res.data).forEach(entry => this.records.push(entry));
		}).catch(err => console.error(err));
	}
}
</script>

<style scoped>
</style>