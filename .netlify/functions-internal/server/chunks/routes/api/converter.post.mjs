import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';

const fetchChatCompletion = async (content) => {
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  const apiKey = "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";
  const requestBody = {
    model: "llama3-8b-8192",
    messages: [{
      role: "user",
      content
    }]
  };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`Erro na requisi\xE7\xE3o: ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API:", error.message);
    throw new Error(`Erro na requisi\xE7\xE3o: ${error}`);
  }
};

const converterPrompt = (query, language) => {
  return `Convert the following SQL query from any SQL dialect into an equivalent SQL query for ${language}. Provide only the converted SQL query in ${language} syntax, without any additional explanations or comments.

    PostgreSQL Query: ${query}
    
    
  Replace all newlines (\\n) with spaces, ensuring the SQL is transformed into a single line.
  Remove all template string delimiters (\`\` characters) present in the SQL.
  Make sure the overall structure of the SQL is maintained, but without the unwanted characters.

`;
};
const validateSqlPrompt = (query) => {
  return `Identify if the provided text is a SQL query. If it is not a SQL query, return undefined. If it is a SQL query, return the name of the SQL dialect. Provide only the name of the SQL dialect or undefined, with no explanation or additional text.
    
    Input Text: ${query}`;
};

const converter_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.content || !body.queryLanguage) {
      return {
        message: "Invalid input",
        success: false
      };
    }
    const { content, queryLanguage } = body;
    const promptValidateSql = validateSqlPrompt(content);
    const sqlType = await fetchChatCompletion(promptValidateSql);
    if (sqlType == "undefined") {
      return {
        message: "Invalid input",
        success: false
      };
    }
    const prompt = converterPrompt(content, queryLanguage);
    const response = await fetchChatCompletion(prompt);
    return {
      message: `Request success!`,
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Error in /api/converter:", error);
    return {
      message: "Internal server error",
      success: false
    };
  }
});

export { converter_post as default };
//# sourceMappingURL=converter.post.mjs.map
