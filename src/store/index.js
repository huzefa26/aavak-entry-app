import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
	plugins: [createPersistedState({
		storage: window.sessionStorage,
	})],
	state: {
		// paddyTypes: ['Dabra', 'Jira', 'Kolam', 'Parimal', 'Guj-17', 'Gujari', 'Basmati', 'Black Paddy'],
		// records: [],
		editEntry: null
	},
	mutations: {
		setEditEntry(state, payload) {
			state.editEntry = payload;
		},
		unsetEditEntry(state) {
			state.editEntry = null;
		},
	},
	actions: {
		// getRecords() {
		// 	;
		// }
	},
	modules: {
	}
})
