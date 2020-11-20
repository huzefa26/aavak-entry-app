<template>
	<div class="wrapper mt-2 mb-5">
		<legend>Today's Summary:</legend>
		<table class="table w-auto">
			<!-- <caption class="text-center">Today's Summary</caption> -->
			<thead class="">
				<tr>
					<th></th>
					<th v-for="type in types" :key="type" scope="col" class="text-center">{{ type }}</th>
					<!-- <th scope="col" class="text-center">Total</th> -->
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Bags</th>
					<td v-for="type in types" :key="type" class="text-right">{{ stats[type].bags }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>
				
				<tr>
					<th scope="row">Weight</th>
					<td v-for="type in types" :key="type" class="text-right">{{ stats[type].weight }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>
				
				<tr>
					<th scope="row">Avg. Rate</th>
					<td v-for="type in types" :key="type" class="text-right">{{ (stats[type].price / stats[type].weight).toFixed(3) }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>

				<tr>
					<th scope="row">Price</th>
					<td v-for="type in types" :key="type" class="text-right">{{ stats[type].price }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		props: ['stats'],
		data () {
			return {
				types: null,
				// totalBags: 0,
				// totalWeight: 0,
				// totalPriceL 0
			}
		},
		created () {
			this.types = Object.keys(this.stats);
		}
	};
</script>

<style scoped>
	div.wrapper {
		font-family: Verdana;
	}
</style>