<template>
	<div class="wrapper" :class="printMode?'mt-0 mb-2':'mt-2 mb-5'">
		<legend>Today's Summary:</legend>
		<table class="table w-auto">
			<!-- <caption class="text-center">Today's Summary</caption> -->
			<thead class="">
				<tr>
					<th :class="{'py-0':printMode}"></th>
					<th v-for="type in types" :key="type" scope="col" class="text-center" :class="{'py-0':printMode}">{{ type }}</th>
					<!-- <th scope="col" class="text-center">Total</th> -->
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row" :class="{'py-0':printMode}">Bags</th>
					<td v-for="type in types" :key="type" class="text-right" :class="{'py-0':printMode}">{{ stats[type].bags }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>
				
				<tr>
					<th scope="row" :class="{'py-0':printMode}">Weight</th>
					<td v-for="type in types" :key="type" class="text-right" :class="{'py-0':printMode}">{{ stats[type].weight }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>
				
				<tr>
					<th scope="row" :class="{'py-0':printMode}">Avg. Rate</th>
					<td v-for="type in types" :key="type" class="text-right" :class="{'py-0':printMode}">{{ parseFloat((stats[type].price / stats[type].weight).toFixed(3)) }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>

				<tr>
					<th scope="row" :class="{'py-0':printMode}">Price</th>
					<td v-for="type in types" :key="type" class="text-right" :class="{'py-0':printMode}">{{ stats[type].price.toFixed(3) }}</td>
					<!-- <td class="text-right">{{ 0 }}</td> -->
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		props: ['stats', 'printMode'],
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