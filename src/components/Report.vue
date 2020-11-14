<template>
	<div class="container">
		<table>
			<thead>
				<tr>
					<th></th>
					<th v-for="type in types">{{ type }}</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>Bags</th>
					<td v-for="type in types">{{ type }}</td>
					<td>{{ 0 }}</td>
				</tr>
				<tr>
					<th>Price</th>
					<td v-for="type in types">{{ type }}</td>
					<td>{{ 0 }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				types: this.$store.state.paddyTypes;
			}
		}
	};
</script>

