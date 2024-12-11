import { useFetch } from '#app';
import type { Response } from '../server/api/converter.post'


export interface Converter {
  status: boolean,
  message: string
}

export const converter = async (content: string, queryLanguage: string):Promise<Converter> => {

  try {

    const { data, error } = await useFetch<Response>('/api/converter', {
      method: 'POST',
      body: { content, queryLanguage },
    });

    if (error.value) {
      console.error('Erro na API:', error.value);
      return {
        status: false,
        message: JSON.stringify(error.value)
      }
    } 

    return  {
      status: true,
      message: data.value?.data
    }
  } catch (err) {
    console.error('Erro ao consumir API:', err);
    return  {
      status: false,
      message: 'Internal error'
    }
  }
};
