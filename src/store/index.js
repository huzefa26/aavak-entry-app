import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	plugins: [createPersistedState({
		storage: window.sessionStorage,
	})],

	state: {
		paddyTypes: ['Basmati', 'Black Paddy', 'Dabra', 'Guj-17', 'Gujari', 'Jira', 'Kolam', 'Mamra', 'Parimal'],
		names: [],
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
		async getNames({ state }) {
			await axios.get('names.json/')
				.then(res => {
					if (res.data != null) {
						state.names = res.data;
					}
				}).catch(err => console.error(err));
		},

		async increaseNameCount({ state }, name) {
			if (state.names[name] == undefined) { // (!state.names.hasOwnProperty(name)) {
				state.names[name] = 0;
			}
			await axios.put('names/'+ name +'.json/?print=silent', ++state.names[name])
				.then(()=>{}).catch(err => console.error(err));
		},

		async decreaseNameCount({ state }, name) {
			if (state.names[name] == undefined) return;
			if (state.names[name] <= 0) return; 
			if (state.names[name] == 1) 
			{
				await axios.delete('names/'+ name +'.json/?print=silent')
					.then(() => {
						delete state.names[name];
					}).catch(err => console.error(err));
			} 
			else 
			{
				await axios.put('names/'+ name +'.json/?print=silent', --state.names[name])
					.then(() => {}).catch(err => console.error(err));
			}
		}
	},
	modules: {
	}
})
