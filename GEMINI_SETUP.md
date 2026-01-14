# 🎯 Quick Setup Guide: Google Gemini

## Your API Key Details
```
API Key: AlzaSyCgv_j6fIEWcM07LnDxwA_qdNvlI0K2ApQ
Project: projects/169670832493
```

## ⚡ Setup in 2 Minutes

### Step 1: Create `.env` file
In the root of your project (same level as `package.json`), create a file named `.env`:

```env
VITE_AI_PROVIDER=google
VITE_API_KEY=AlzaSyCgv_j6fIEWcM07LnDxwA_qdNvlI0K2ApQ
```

**Important:** Replace the API key with your actual key from the screenshot!

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: Test It!
1. Open your app in browser
2. Click the blue floating button (bottom-right corner)
3. Ask a question like "What is recursion?"
4. You should get a real answer from Google Gemini! 🎉

---

## 📝 Example Questions to Try

- "Explain Binary Search Trees"
- "How do I calculate time complexity?"
- "What is the difference between BFS and DFS?"
- "Explain the OSI model"
- "What are ACID properties in databases?"
- "How does recursion work?"

---

## ✅ What's Configured

✅ Google Gemini API is ready to use
✅ 60 requests per minute (FREE)
✅ Works for B.Tech exam prep
✅ Fallback to mock responses if API fails
✅ Auto-retries on network errors

---

## 🆘 Troubleshooting

### **Question: The chatbot still gives mock responses**
**Answer:** 
1. Make sure `.env` file exists (not `.env.example`)
2. Restart dev server: `npm run dev`
3. Check browser console (F12) for errors
4. Verify API key is correct

### **Question: I get an API error**
**Answer:**
1. Check your API key is correct in `.env`
2. Make sure it's from https://makersuite.google.com/app/apikey
3. Check you haven't exceeded quota (60 requests/minute)
4. Restart the app and try again

### **Question: Can I use a different API provider?**
**Answer:** Yes! Check `FREE_AI_SETUP.md` in the AIAssistant folder for other options.

---

## 🚀 Next Steps

1. ✅ Create `.env` with your API key
2. ✅ Restart dev server
3. ✅ Test the chatbot
4. ✅ Deploy to production (API key is safe in `.env`)

---

## 📚 More Info

- **Component Code:** `src/components/AIAssistant/AIAssistantChat.tsx`
- **Full Setup Guide:** `src/components/AIAssistant/FREE_AI_SETUP.md`
- **API Docs:** https://ai.google.dev/docs

---

**Status:** ✅ Ready to use with Google Gemini!
