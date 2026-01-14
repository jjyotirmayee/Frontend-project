/**
 * Alternative AI Provider Implementations
 * Copy and paste these functions into AIAssistantChat.tsx based on your chosen provider
 */

// ============================================
// OPENROUTER IMPLEMENTATION (RECOMMENDED!)
// ============================================
export const generateFromOpenRouter = async (userMessage: string, apiKey: string): Promise<string | null> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // Free model, or use 'gpt-3.5-turbo' for better quality
        messages: [
          {
            role: 'system',
            content: 'You are an expert B.Tech and engineering exam preparation tutor. Answer questions concisely and accurately for students preparing for exams.',
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('OpenRouter API error:', error);
      return null;
    }

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }

    return null;
  } catch (error) {
    console.error('OpenRouter error:', error);
    return null;
  }
};

// ============================================
// OLLAMA IMPLEMENTATION (Local, Free)
// ============================================
export const generateFromOllama = async (userMessage: string, ollamaUrl: string = 'http://localhost:11434'): Promise<string | null> => {
  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral', // or 'neural-chat', 'llama2'
        prompt: `You are an expert B.Tech and engineering exam preparation tutor. Answer this question concisely for a student: ${userMessage}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 200,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Ollama API error');
      return null; // Will use fallback
    }

    const data = await response.json();
    return data.response?.trim() || null;
  } catch (error) {
    console.error('Ollama error:', error);
    console.warn('Make sure Ollama is running: ollama serve');
    return null; // Will use fallback
  }
};

// ============================================
// GOOGLE GEMINI IMPLEMENTATION
// ============================================
export const generateFromGoogle = async (userMessage: string, apiKey: string): Promise<string | null> => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert B.Tech and engineering exam preparation tutor. Answer this question concisely (2-3 sentences) for a student preparing for exams: ${userMessage}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      }),
      // Add API key as query parameter
    });

    if (!response.ok) {
      console.warn('Google API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    return null;
  } catch (error) {
    console.error('Google API error:', error);
    return null;
  }
};

// ============================================
// TOGETHER.AI IMPLEMENTATION
// ============================================
export const generateFromTogether = async (userMessage: string, apiKey: string): Promise<string | null> => {
  try {
    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.1',
        prompt: `You are an expert B.Tech and engineering exam preparation tutor. Answer this question concisely: ${userMessage}`,
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['<|im_end|>'],
      }),
    });

    if (!response.ok) {
      console.warn('Together.ai error:', response.status);
      return null;
    }

    const data = await response.json();
    const output = data.output?.choices?.[0]?.text?.trim();
    return output || null;
  } catch (error) {
    console.error('Together.ai error:', error);
    return null;
  }
};

// ============================================
// COHERE API IMPLEMENTATION
// ============================================
export const generateFromCohere = async (userMessage: string, apiKey: string): Promise<string | null> => {
  try {
    const response = await fetch('https://api.cohere.com/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-light',
        prompt: `You are a B.Tech exam tutor. Answer: ${userMessage}`,
        max_tokens: 200,
        temperature: 0.7,
        stop_sequences: ['\n\n'],
      }),
    });

    if (!response.ok) {
      console.warn('Cohere error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.generations?.[0]?.text?.trim() || null;
  } catch (error) {
    console.error('Cohere error:', error);
    return null;
  }
};

// ============================================
// USAGE INSTRUCTIONS
// ============================================
/*
To use any of these implementations:

1. Update your AIAssistantChat.tsx generateAIResponse function:

   const generateAIResponse = async (userMessage: string): Promise<string> => {
     const provider = (import.meta as any).env?.VITE_AI_PROVIDER;
     const token = (import.meta as any).env?.VITE_API_KEY;

     switch (provider) {
       case 'openrouter':
         const result = await generateFromOpenRouter(userMessage, token);
         return result || generateMockResponse(userMessage);
       
       case 'ollama':
         const ollamaResult = await generateFromOllama(userMessage);
         return ollamaResult || generateMockResponse(userMessage);
       
       case 'google':
         const googleResult = await generateFromGoogle(userMessage, token);
         return googleResult || generateMockResponse(userMessage);
       
       case 'together':
         const togetherResult = await generateFromTogether(userMessage, token);
         return togetherResult || generateMockResponse(userMessage);
       
       default:
         return generateMockResponse(userMessage);
     }
   };

2. Add the corresponding .env variables:
   - For OpenRouter: VITE_AI_PROVIDER=openrouter
                    VITE_API_KEY=your_openrouter_key
   - For Ollama: VITE_AI_PROVIDER=ollama
                VITE_OLLAMA_URL=http://localhost:11434
   - For Google: VITE_AI_PROVIDER=google
                VITE_API_KEY=your_google_key
   - For Together: VITE_AI_PROVIDER=together
                  VITE_API_KEY=your_together_key

3. Restart your dev server and test!
*/
