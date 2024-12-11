import { defineEventHandler, readBody } from 'h3';
import { fetchChatCompletion } from '../service/groqCoud'
import { converterPrompt, validateSqlPrompt } from '../prompts/pronpts';

interface Request {
  content: string;
  queryLanguage: string
}

export interface Response {
  message: string;
  success: boolean;
  data?: any | any[];
}

export default defineEventHandler(async (event): Promise<Response> => {
  const body = await readBody<Request>(event);

  if (!body.content || !body.queryLanguage) {
    return {
      message: 'Invalid input',
      success: false
    };
  }

  const { content, queryLanguage } = body;

  const promptValidateSql = validateSqlPrompt(content);

  const sqlType = await fetchChatCompletion(promptValidateSql)

  if (sqlType == 'undefined') {
    return  {
      message: 'Invalid input',
      success: false
    };
  }

  const prompt = converterPrompt(content, queryLanguage)

  const response = await fetchChatCompletion(prompt)

  return {
    message: `Request success!`,
    success: true,
    data: response
  };
});
