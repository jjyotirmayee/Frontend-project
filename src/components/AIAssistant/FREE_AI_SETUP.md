# 🆓 FREE AI API Setup Guide for Exam Prep Assistant

## Quick Start (No Setup Required!)
The chatbot works with **mock responses out of the box**. No API keys needed to test locally!

---

## 🚀 Setup Instructions by Provider

### **Option 1: 🤗 Hugging Face (RECOMMENDED FOR BEGINNERS)**

**Why Hugging Face?**
- ✅ Completely free with no credit card
- ✅ 70,000+ models available
- ✅ Fair use unlimited free tier
- ✅ Best for educational projects
- ✅ Easy to use

**Steps:**

1. **Sign up** (free, no credit card):
   ```
   https://huggingface.co/join
   ```

2. **Create API Token**:
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Name: `exam-prep-assistant`
   - Type: `read` (for inference only)
   - Copy the token

3. **Update `.env` file**:
   ```env
   VITE_AI_PROVIDER=huggingface
   VITE_HF_TOKEN=hf_YOUR_TOKEN_HERE
   ```

4. **Run your app**:
   ```bash
   npm run dev
   ```

5. **Test**: Open the chatbot and ask a question!

---

### **Option 2: 🦙 Ollama (COMPLETELY LOCAL & PRIVATE)**

**Why Ollama?**
- ✅ Completely free and open-source
- ✅ Works completely offline
- ✅ No API keys or internet needed
- ✅ Perfect for development
- ✅ Best for privacy

**Steps:**

1. **Download Ollama**:
   - Visit https://ollama.ai
   - Download for your OS (Windows, Mac, Linux)
   - Install and run

2. **Pull a model** (open terminal/command prompt):
   ```bash
   ollama pull mistral
   ```
   
   Or other options:
   ```bash
   ollama pull neural-chat
   ollama pull llama2
   ```

3. **Ollama starts automatically** on `http://localhost:11434`

4. **Update `.env` file**:
   ```env
   VITE_AI_PROVIDER=ollama
   VITE_OLLAMA_URL=http://localhost:11434
   ```

5. **Test**: The chatbot will use your local model!

**Note**: First response takes a few seconds as it loads the model into memory.

---

### **Option 3: 🎯 Google Gemini (POWERFUL FREE TIER)**

**Why Google Gemini?**
- ✅ Very powerful AI (better than most free options)
- ✅ 60 requests/minute free (very generous)
- ✅ No credit card needed (yes, really!)
- ✅ Fast responses

**Steps:**

1. **Get API Key** (completely free):
   - Visit https://makersuite.google.com/app/apikey
   - Click "Create API key"
   - Copy the key

2. **Install Google AI library**:
   ```bash
   npm install @google/generative-ai
   ```

3. **Update `.env` file**:
   ```env
   VITE_AI_PROVIDER=google
   VITE_GOOGLE_API_KEY=AIzaSy...
   ```

4. **Update component code**:
   
   Replace the `generateFromHuggingFace` function with:
   ```typescript
   const generateFromGoogle = async (userMessage: string, token: string): Promise<string> => {
     try {
       const { GoogleGenerativeAI } = await import('@google/generative-ai');
       const genAI = new GoogleGenerativeAI(token);
       const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

       const result = await model.generateContent(
         `You are a B.Tech exam tutor. Answer concisely: ${userMessage}`
       );

       return (await result.response).text() || generateMockResponse(userMessage);
     } catch (error) {
       console.error('Google API error:', error);
       return generateMockResponse(userMessage);
     }
   };
   ```

---

### **Option 4: 🚀 Together.ai (GREAT FOR DEPLOYMENT)**

**Why Together.ai?**
- ✅ $1 free monthly credits
- ✅ Multiple open-source models
- ✅ Great for production deployment
- ✅ Very fast

**Steps:**

1. **Sign up**:
   ```
   https://www.together.ai/
   ```

2. **Get API Key**:
   - Go to dashboard
   - Create new API key
   - Copy it

3. **Update `.env` file**:
   ```env
   VITE_AI_PROVIDER=together
   VITE_TOGETHER_API_KEY=YOUR_KEY_HERE
   ```

---

## 📊 Comparison Table

| Feature | Hugging Face | Ollama | Google Gemini | Together.ai |
|---------|-------------|--------|---------------|------------|
| **Cost** | Free | Free | Free | Free |
| **Setup** | 2 min | 5 min | 2 min | 3 min |
| **Credit Card** | ❌ | ❌ | ❌ | ❌ |
| **Quality** | Good | Good | Excellent | Good |
| **Speed** | Medium | Slow* | Fast | Fast |
| **Offline** | ❌ | ✅ | ❌ | ❌ |
| **Best For** | Learning | Privacy | Production | Deployment |

*Ollama speed depends on your hardware

---

## 🔧 Implementation Examples

### **If using Hugging Face** (Already implemented!)
Just set your token and go.

### **If using Ollama**
Update the `generateAIResponse` function:

```typescript
const generateFromOllama = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `You are a B.Tech tutor. Answer: ${userMessage}`,
        stream: false,
      }),
    });

    if (!response.ok) return generateMockResponse(userMessage);
    
    const data = await response.json();
    return data.response || generateMockResponse(userMessage);
  } catch (error) {
    return generateMockResponse(userMessage);
  }
};
```

---

## 💡 Pro Tips

1. **Development**: Use Ollama (free, no setup, works offline)
2. **Testing**: Use Hugging Face (generous free tier)
3. **Production**: Use Together.ai or Google Gemini
4. **Switch Easily**: Just change `VITE_AI_PROVIDER` in `.env`

---

## 🆘 Troubleshooting

### **Ollama not responding**
- Make sure Ollama is running: `ollama serve`
- Check it's accessible: `http://localhost:11434`
- Pull a model: `ollama pull mistral`

### **Hugging Face API errors**
- Verify token is correct at https://huggingface.co/settings/tokens
- Check model is loaded: https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1
- Wait a few seconds between requests (rate limiting)

### **Env variables not loading**
- Make sure you have `.env` (not `.env.example`)
- Restart dev server after adding env vars
- Check console for errors

---

## 📚 Resources

- **Hugging Face**: https://huggingface.co
- **Ollama**: https://ollama.ai
- **Google Gemini**: https://ai.google.dev
- **Together.ai**: https://www.together.ai/
- **Vite Env Variables**: https://vitejs.dev/guide/env-and-modes

---

## ✨ Next Steps

1. Choose your preferred provider
2. Follow the setup steps
3. Add your API key to `.env`
4. Restart your dev server
5. Test the chatbot!

All options are completely **free for educational use**! 🎓

---

**Last Updated:** January 14, 2026
**Status:** ✅ Ready for use
