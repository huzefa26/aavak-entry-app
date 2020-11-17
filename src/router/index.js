import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Records from '../components/Records.vue'
import EditEntry from '../components/EditEntry.vue'

Vue.use(VueRouter)

const routes = [
	{ path: '/', name: 'Home', component: Home },
	{ path: '/records/:date', name: 'Records', component: Records },
	{ path: '/edit'/*/:date/:name/:idx*/, name: 'Edit', component: EditEntry },
	// { path: '/edit', name: 'Edit', component: EditEntry },

	{ path: '/*', redirect: '/'}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
