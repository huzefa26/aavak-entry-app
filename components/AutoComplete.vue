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
		<ul
			id="autocomplete-results"
			v-show="isOpen"
			class="autocomplete-results"
		>
			<li
				class="loading"
				v-if="isLoading"
				>
				Loading results...
			</li>
			<li
				v-else
				v-for="(result, i) in results"
				:key="i"
				@click="setResult(result)"
				class="autocomplete-result"
				:class="{ 'is-active': i === arrowCounter }"
			>
				{{ result }}
			</li>
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
				// Let's warn the parent that a change was made
				this.$emit('input', this.search);

				// Is the data given by an outside ajax request?
				if (this.isAsync) {
					this.isLoading = true;
				} else {
					// Let's our flat array
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
			},
			onArrowDown(evt) {
				if (this.arrowCounter < this.results.length) {
					this.arrowCounter = this.arrowCounter + 1;
				}
			},
			onArrowUp() {
				if (this.arrowCounter > 0) {
					this.arrowCounter = this.arrowCounter -1;
				}
			},
			onEnter() {
				this.search = this.results[this.arrowCounter];
				this.isOpen = false;
				this.arrowCounter = -1;
			},
			handleClickOutside(evt) {
				if (!this.$el.contains(evt.target)) {
					this.isOpen = false;
					this.arrowCounter = -1;
				} else {
					this.isOpen = true;
					this.filterResults();
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
			document.addEventListener('click', this.handleClickOutside);
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
		z-index: 1;
		padding: 0;
		margin: 0;
		border: 2px solid #bba;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		/*height: 120px;*/
		overflow: auto;
		width: 100%;
	}

	.autocomplete-result {
		list-style: none;
		text-align: left;
		padding: 4px;
		cursor: pointer;
		border-bottom: 1px solid #ddd;
		border-bottom-left-radius: 3px;
		border-bottom-right-radius: 3px;
	}

	.autocomplete-result.is-active,
	.autocomplete-result:hover {
		background-color: #aa9;
		color: white;
	}
</style>