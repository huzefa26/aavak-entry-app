<template>
	<div class="container p-0 mb-5">
		<nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
			<router-link class="navbar-brand" to="/"><h1>Entry</h1></router-link>	
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<div class="form-inline my-2 my-lg-0 ml-auto">
					<input class="form-control mr-sm-2" type="date" v-model="date" aria-label="Date">
					<router-link class="btn btn-outline-success my-2 my-sm-0" :to="'/records/'+date">
						Search
					</router-link>
				</div>
			</div>
		</nav>
		<!-- <hr class="mb-5"> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				date: this.today(),
			};
		},
		methods: {
			today() {
				let date = new Date();
				return date.getFullYear().toString() + '-'
				 + (date.getMonth() + 1).toString().padStart(2, 0) + '-'
				 + date.getDate().toString().padStart(2, 0);
			}
		},
		created() {
			// console.log(this.today());
		}
	};
</script>

<style scoped>
	a, input[type=date] {
		font-size: 120%;
	}
	/*.navbar {
		background-color: #e3f2fd;
	}*/
	div.container {
		border-bottom: 1px solid #44aa5a;
	}
</style>
