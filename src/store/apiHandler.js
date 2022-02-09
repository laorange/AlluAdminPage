import {
	defineStore
} from 'pinia'

export const useApiHandler = defineStore('apiHandler', {
	state: () => {
		return {
			period: 30,
			apiResult: []
		}
	},
	// actions: {

	// },
})
