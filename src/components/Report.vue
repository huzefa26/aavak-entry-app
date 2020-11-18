<template>
	<div class="container">
		<table>
			<thead>
				<tr>
					<th></th>
					<th v-for="type in types" :key="type">{{ type }}</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>Bags</th>
					<td v-for="type in types" :key="type">{{ stats[type].bags }}</td>
					<td>{{ 0 }}</td>
				</tr>
				
				<tr>
					<th>Weight</th>
					<td v-for="type in types" :key="type">{{ stats[type].weight }}</td>
					<td>{{ 0 }}</td>
				</tr>
				
				<tr>
					<th>Avg. Rate</th>
					<td v-for="type in types" :key="type">{{ stats[type].rate }}</td>
					<td>{{ 0 }}</td>
				</tr>

				<tr>
					<th>Price</th>
					<td v-for="type in types" :key="type">{{ stats[type].price }}</td>
					<td>{{ 0 }}</td>
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
				types: null
			}
		},
		created () {
			this.types = Object.keys(this.stats);
		}
	};
</script>

