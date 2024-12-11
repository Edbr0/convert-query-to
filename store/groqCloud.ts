import { defineStore } from 'pinia'
import { converter, type Converter } from '../api/request'



interface Store {
  response: Converter
}

export const contentStore = defineStore({
    id: 'content',
    state: (): Store => ({
    response: {
        status: false,
        message: ''
    }
    }),
    actions: {
        async getResponse(content: string, queryLanguage: string) {
            const response = await converter(content, queryLanguage)
            this.response = response
        }
    }
})