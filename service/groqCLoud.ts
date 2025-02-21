 // Define os tipos para os dados da API
 interface Message {
    role: string;
    content: string;
  }

interface RequestBody {
    model: string;
    messages: Message[];
}

interface ApiResponse {
    id: string;
    object: string;
    created: number;
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
        index: number;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export const fetchChatCompletion = async (content: string):Promise<string> => {
  
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    const apiKey = "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"; 
  
    const requestBody: RequestBody = {
      model: "llama3-8b-8192",
      messages:[ {
        role: "user",
        content: content
      }],
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
  
      const data: ApiResponse = await response.json();

      return data.choices[0].message.content as string;
    } catch (error) {
      console.error("Erro ao chamar a API:", (error as Error).message);
      throw new Error(`Erro na requisição: ${error}`);
    }
  };
  
