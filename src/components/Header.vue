<template>
	<div class="container p-0 mb-5">
		<nav class="navbar navbar-expand-md navbar-light  justify-content-between">
			<router-link tag="a" class="navbar-brand" to="/"><h1>Entry</h1></router-link>	
			<button id="togglerButton" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon font-weight-bold"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<div class="form-inline form-row my-2 my-md-0 ml-auto mr-md-0 mr-auto">
					<input class="col form-control mr-1 bg-light" type="date" v-model="date" aria-label="Date">
					<button class="col btn btn-outline-dark my-2 my-md-0 px-md-2 ml-1"  @click="searched">
						Search
					</button>
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
			},
			searched() {
				if (this.$router.currentRoute.path != '/records/' + this.date +'/') {
					document.getElementById('togglerButton').click();
					this.$router.push('/records/' + this.date +'/');
				}
			}
		}
	};
</script>

<style scoped>
	
	div.container {
		border-bottom: 2px solid #444;
		border-bottom-left-radius: 1px;
		border-bottom-right-radius: 1px;
	}

	.navbar {
		background-color: #eee;
	}

	a, input[type=date] {
		font-size: 120%;
	}

	/*input[type=date]::-webkit-datetime-edit-fields-wrapper {
		padding-right: 0;
	}*/
	/*input[type=date]::-webkit-calendar-picker-indicator {}*/
	input[type=date]::-webkit-datetime-edit-text {
		color: silver;
	}
</style>
