import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import './AIAssistantChat.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Exam Preparation Assistant. I'm here to help you with B.Tech and engineering subjects. Ask me anything about Data Structures, DSA, Theory of Computation, Computer Networks, Operating Systems, and more! 📚",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Check if using real AI API or fallback to mock responses
    const apiProvider = (import.meta as any).env?.VITE_AI_PROVIDER;
    const apiKey = (import.meta as any).env?.VITE_API_KEY;
    
    // Determine which provider to use
    if (apiProvider === 'google' && apiKey) {
      return await generateFromGoogle(userMessage, apiKey);
    }
    
    if (apiProvider === 'openrouter' && apiKey) {
      return await generateFromOpenRouter(userMessage, apiKey);
    }
    
    if (apiProvider === 'huggingface' && apiKey) {
      return await generateFromHuggingFace(userMessage, apiKey);
    }

    // Fallback: Use mock responses based on keywords
    return generateMockResponse(userMessage);
  };

  const generateFromGoogle = async (userMessage: string, apiKey: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
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
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.warn('Google API error:', error);
        return generateMockResponse(userMessage);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }

      return generateMockResponse(userMessage);
    } catch (error) {
      console.error('Google API error:', error);
      return generateMockResponse(userMessage);
    }
  };

  const generateFromOpenRouter = async (userMessage: string, token: string): Promise<string> => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
        return generateMockResponse(userMessage);
      }

      const data = await response.json();

      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }

      return generateMockResponse(userMessage);
    } catch (error) {
      console.error('OpenRouter error:', error);
      return generateMockResponse(userMessage);
    }
  };

  const generateFromHuggingFace = async (userMessage: string, token: string): Promise<string> => {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `You are an expert B.Tech and engineering exam preparation tutor. Answer this question concisely (max 2-3 sentences) for a student preparing for exams: ${userMessage}`,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn('HF API error, using fallback');
        return generateMockResponse(userMessage);
      }

      const result = await response.json();
      
      if (Array.isArray(result) && result[0]?.generated_text) {
        // Extract only the generated part (remove prompt)
        const text = result[0].generated_text;
        const generatedPart = text.split('tutor.')[1]?.trim() || text;
        return generatedPart || generateMockResponse(userMessage);
      }

      return generateMockResponse(userMessage);
    } catch (error) {
      console.error('AI API error:', error);
      return generateMockResponse(userMessage);
    }
  };

  const generateMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses: { [key: string]: string } = {
      'data structures': 'Data Structures are fundamental concepts in computer science. Common types include Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs. What specific data structure would you like to learn about?',
      'algorithm': 'Algorithms are step-by-step procedures for solving problems. Key concepts include Time Complexity (Big O notation), Space Complexity, Sorting Algorithms (Quick Sort, Merge Sort, etc.), and Searching Algorithms (Binary Search, Linear Search). What would you like to explore?',
      'recursion': 'Recursion is a technique where a function calls itself to solve smaller instances of the same problem. Key points: Base case to stop recursion, Recursive case, and Stack overflow prevention. Would you like examples?',
      'tree': 'Trees are hierarchical data structures with nodes and edges. Types include Binary Trees, BST, AVL Trees, and N-ary Trees. Common operations: Traversal (InOrder, PreOrder, PostOrder), Insertion, Deletion, and Searching.',
      'graph': 'Graphs consist of vertices (nodes) and edges (connections). Types: Directed/Undirected, Weighted/Unweighted. Algorithms: DFS, BFS, Dijkstra, Floyd-Warshall. Applications: Social Networks, GPS Navigation, Recommendation Systems.',
      'complexity': 'Time Complexity measures how runtime grows with input size. Space Complexity measures memory usage. Big O Notation: O(1) - Constant, O(log n) - Logarithmic, O(n) - Linear, O(n²) - Quadratic, O(2ⁿ) - Exponential.',
      'network': 'Computer Networks involve data communication. Key topics: OSI Model (7 layers), TCP/IP Protocol, DNS, HTTP/HTTPS, IP Addressing, Subnetting, Routing, and Security Protocols.',
      'operating system': 'Operating Systems manage computer resources. Topics: Process Management, Memory Management, File Systems, Deadlocks, Synchronization, and Virtual Memory.',
      'database': 'Databases store and manage data. Types: Relational (SQL), NoSQL, Document. Concepts: Normalization, ACID Properties, Transactions, Indexing, Queries (SELECT, JOIN, Aggregation).',
    };

    // Find matching response
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Default response
    return "Great question! I can help you with topics like Data Structures, Algorithms, Trees, Graphs, Complexity Analysis, Computer Networks, Operating Systems, and Databases. Feel free to ask me anything about your exam preparation! 📖";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(async () => {
      const responseText = await generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* Chat Window */}
      {isOpen && (
        <Card className="ai-assistant-window">
          <div className="ai-assistant-header">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Exam Prep Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="ai-assistant-messages">
            <div className="flex flex-col gap-3 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-xs px-3 py-2 rounded-lg text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="ai-assistant-input">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me about your exams..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'ai-assistant-button',
          isOpen && 'hidden'
        )}
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
