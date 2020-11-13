<template>
	<div class="autocomplete">
		<input
			type="text"
			:id="inputId"
			class="form-control"
			v-model="search"
			@input="onChange"
			@keydown.down="onArrowDown"
			@keydown.up="onArrowUp"
			@keydown.enter="onEnter"
		/>
		<!-- <div id="autocomplete-results" v-show="isOpen" class="autocomplete-results container">
			<div v-if="isLoading" class="row"><div class="loading col">Loading results...</div></div>
			<div v-else>
				<div class="autocomplete-result row" 
					v-for="(result, i) in results" 
					:key="i" 
					:class="{ 'is-active': i === arrowCounter }"
					@click="setResult(result)"
				>
					<div class="col">{{ result }}</div>
				</div>
			</div>
		</div> -->
		<ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
			<li class="loading" v-if="isLoading">Loading results...</li>
			<li
				v-else
				v-for="(result, i) in results"
				:key="i"
				@click="setResult(result)"
				class="autocomplete-result pl-1 pr-3"
				:class="{ 'is-active': i === arrowCounter }"
			>{{ result }}</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'autocomplete',

		props: {
			items: {
				type: Array,
				required: false,
				default: () => [],
			},
			isAsync: {
				type: Boolean,
				required: false,
				default: false,
			},
			inputId: {
				type: String,
				required: false,
				default: ''
			},
			showFirst: {
				type: Boolean,
				required: false,
				default: false
			}
		},

		data() {
			return {
				isOpen: false,
				results: [],
				search: '',
				isLoading: false,
				arrowCounter: 0,
			};
		},

		methods: {
			onChange() {
				this.$emit('input', this.search);

				if (this.isAsync) {
					this.isLoading = true;
				} else {
					this.filterResults();
					this.isOpen = true;
				}
			},

			filterResults() {
				this.results = this.items.filter((item) => {
					return item.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
				});
			},
			setResult(result) {
				this.search = result;
				this.isOpen = false;
				this.$emit('input', result);
			},
			onArrowDown(evt) {
				if (++this.arrowCounter >= this.results.length) 
					this.arrowCounter = 0;;
			},
			onArrowUp() {
				if (--this.arrowCounter < 0) 
					this.arrowCounter = this.results.length - 1;
			},
			onEnter() {
				this.setResult(this.results[this.arrowCounter]);
				this.arrowCounter = -1;
			},
			handleClickOutside(evt) {
				if (!this.$el.contains(evt.target)) {
					this.isOpen = false;
					this.arrowCounter = -1;
				}
			}
		},
		watch: {
			items: function (val, oldValue) {
				// actually compare them
				if (val.length !== oldValue.length) {
					this.results = val;
					this.isLoading = false;
				}
			},
		},
		mounted() {
			if (this.showFirst && this.items.length > 0) this.search = this.items[0];
			document.addEventListener('click', this.handleClickOutside);
			console.log(document.getElementById(this.inputId).width);
		},
		destroyed() {
			document.removeEventListener('click', this.handleClickOutside);
		}
	};
</script>

<style>
	.autocomplete {
		position: relative;
		font-size: 125%;
	}
	input[type=text] {
		font-size: 125%;
	}

	.autocomplete-results {
		background-color: white;
		position: fixed;
		z-index: 100;
		padding: 0;
		margin: 0;
		border: 2px solid #bba;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		/*height: 120px;*/
		overflow: auto;
		/* display: block; */
		width: auto;
	}

	.autocomplete-result {
		list-style: none;
		text-align: left;
		/* padding: 5px 10px 1px 8px; */
		cursor: pointer;
		border-bottom: 1px solid #ddd;
		border-bottom-left-radius: 3px;
		border-bottom-right-radius: 3px;
		/* width: auto; */
	}

	.autocomplete-result.is-active,
	.autocomplete-result:hover {
		background-color: #aa9;
		color: white;
	}
</style>