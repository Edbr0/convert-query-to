import { useFetch } from '#app';
import { fetchChatCompletion } from '../service/groqCLoud'
import { converterPrompt, validateSqlPrompt } from '../utils/prompts/prompts'


export interface Converter {
  status: boolean,
  message: string
}

export const converter = async (content: string, queryLanguage: string):Promise<Converter> => {

  try {

    const promptValidateSql = validateSqlPrompt(content);

    const sqlType = await fetchChatCompletion(promptValidateSql)

    if (sqlType == 'undefined') {
      return  {
        message: 'Invalid input',
        status: false
      };
    }

    const prompt = converterPrompt(content, queryLanguage)

    const response = await fetchChatCompletion(prompt)

    return {
      message: response,
      status: true,
    };

  } catch (err) {
    console.error('Erro ao consumir API:', err);
    return  {
      status: false,
      message: 'Internal error'
    }
  }
};
