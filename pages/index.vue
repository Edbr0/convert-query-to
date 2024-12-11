<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { contentStore } from '../store/groqCloud'
  import { queryLanguageStore } from '../store/queryLanguage'
  import { format } from 'sql-formatter';
  import TextAreaCode from '../components/TextAreaCode.vue'
  import SelectSql from '../components/SelectSql.vue'
  import { useDialog } from 'naive-ui';
  import { DatabaseEngines } from '../utils'


  definePageMeta({
    layout: 'default', // Garante que o layout padrão será usado
  });

  export default defineComponent({
    components:{
      TextAreaCode,
      SelectSql
    },
    setup(){

      const prompt = ref<string>('');

      const response = ref<string>('');

      const loading = ref<boolean>(false)

      const store = contentStore()

      const queryStory = queryLanguageStore()

      const dialog = useDialog()

      const convert = async () => {
        const inputTextUpper = prompt.value.toUpperCase()

        if (!inputTextUpper) return dialog.info({
          title: 'Atenção',
          content: 'É necessário iformar um sql válido',
          positiveText: 'OK'
        })

        const querySelected =  queryStory.getQueryLanguage();

        if (!querySelected.value || !querySelected.label) return dialog.info({
          title: 'Atenção',
          content:'É necessário iformar uma liguagem',
          positiveText: 'OK'
        })

        loading.value = true;

        await store.getResponse(inputTextUpper, querySelected.label as string)

        const newQuery = store.response

        if (!newQuery.status) return dialog.info({
          title: 'Atenção',
          content: newQuery.message,
          positiveText: 'OK'
        })

        response.value = format(newQuery.message.trim() ?? '', { language: querySelected.value || DatabaseEngines.SQL, tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 })
        loading.value = false;
       
      }

      return {
        prompt,
        convert,
        response,
        loading
      }
    }
  })
</script>
<style>
  .w-card-input{
    width: 600px;
  }
</style>
<template>
  <n-space vertical class="p25">
    <n-flex justify="space-around">
      <div class="w-50">
        <n-gradient-text gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)" class="mb3">
          Convert query to:
        </n-gradient-text>
        <SelectSql/>
      </div>
    </n-flex>
    <n-flex class="mt10" justify="space-around" align="center">
      <div class="w-card-input">
        <n-space vertical>
            <n-input
            h-lg
            type="textarea"
            placeholder="Digite ou cole seu sql aqui"
            :autosize="{
                minRows: 3
            }"
            v-model:value="prompt"
            /> 
          </n-space>
      </div>
      <n-button @click="convert" :loading="loading" type="success">Converter</n-button>
      <div class="w-card-input">
        <TextAreaCode  :content="{ text: response, type: 'sql' }"/>
      </div>
    </n-flex>
  </n-space>
</template>

<style scoped>
.n-gradient-text {
  font-size: 24px;
}
</style>