import { defineStore } from 'pinia'

interface Language {
    label: string | null,
    value: string | null
}

interface Query {
    selected: Language
}

export const queryLanguageStore = defineStore({
    id: 'query',
    state: (): Query => ({
        selected: {
            label: null,
            value: null
        }
    }),
    actions: {
        getQueryLanguage() {
            return this.selected;
        },

        setQueryLanguage(queryLanguage: Language) {
           this.selected = queryLanguage;
        }
    }
})