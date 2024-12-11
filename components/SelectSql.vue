<template>
    <n-space vertical>
      <n-select size="large" 
      v-model:value="selectedOption" 
      :options="options"  
      :value-field="'value'"
      :label-field="'label'"
      :key-field="'value'"
      @update:value="handleSelectChange"
      />
    </n-space>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { queryLanguageStore } from '../store/queryLanguage'
  import { databaseOptions} from '@/utils'
  
  export default defineComponent({
    setup() {

      const selectedOption =  ref(null)
      const store = queryLanguageStore()
      const options = databaseOptions;
      const handleSelectChange = (newValue: any) => {
        const selected = options.filter(item => item.value == newValue)
        store.setQueryLanguage(selected[0]) 
      }

      return {
        selectedOption,
        options,
        handleSelectChange
      }
    }
  })
  </script>