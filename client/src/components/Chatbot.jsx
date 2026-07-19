import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sprout } from 'lucide-react';

const FAQ_DATABASE = [
  {
    question: "What crops can this AI detect?",
    answer: "Currently, AgriVision AI supports disease detection for Tomato, Potato, and Rice crops. We classify major diseases like Early Blight, Late Blight, Bacterial Spot, Rice Blast, and Brown Spot, as well as identifying healthy leaves."
  },
  {
    question: "How do I scan a crop leaf?",
    answer: "Go to the 'Scan Leaf' tab. Drag and drop a clear, well-lit photo of the leaf or use your device camera. Click 'Get Diagnosis' to analyze it. Our CNN model runs the analysis and returns treatments."
  },
  {
    question: "How to treat Late Blight?",
    answer: "For Late Blight (Potato/Tomato): Remove and destroy all infected foliage immediately. Organically, apply copper-based sprays. Chemically, spray Metalaxyl + Mancozeb (2.5g per liter of water) immediately at the first sign."
  },
  {
    question: "What organic options do you recommend?",
    answer: "We recommend organic treatments like bio-fungicides (Bacillus subtilis), neem oil, copper oxychloride sprays, mulching, crop rotation, and balanced compost to build natural plant immunity."
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm your AgriVision AI assistant. Click a question below or type a query about crop care!" }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Generate response
    setTimeout(() => {
      let botResponse = "I'm still learning! Could you please select one of the popular questions below or consult an expert?";
      const cleanText = text.toLowerCase();

      // Check FAQ database matches
      for (const faq of FAQ_DATABASE) {
        if (cleanText.includes(faq.question.toLowerCase()) || faq.question.toLowerCase().split(' ').some(word => word.length > 4 && cleanText.includes(word))) {
          botResponse = faq.answer;
          break;
        }
      }

      // Keyword matches
      if (botResponse === "I'm still learning! Could you please select one of the popular questions below or consult an expert?") {
        if (cleanText.includes('blight')) {
          botResponse = "Blight is a common fungal disease. Early Blight forms target-like rings, while Late Blight forms wet spots with fuzzy white growth. Keep leaves dry, prune lower stems, and use copper fungicides.";
        } else if (cleanText.includes('rice') || cleanText.includes('blast')) {
          botResponse = "Rice Blast creates spindle-shaped grey lesions. Avoid over-applying nitrogen fertilizer, use clean seeds, and spray Tricyclazole (0.6g/L) if infection spreads.";
        } else if (cleanText.includes('tomato')) {
          botResponse = "For Tomato, we detect Bacterial Spot, Early Blight, and Late Blight. Remove infected leaves immediately and ensure wide plant spacing to improve airflow.";
        } else if (cleanText.includes('potato')) {
          botResponse = "For Potato, we detect Early Blight and Late Blight. Crop rotation and certified disease-free seeds are the best prevention steps.";
        } else if (cleanText.includes('organic') || cleanText.includes('neem')) {
          botResponse = "Organic management includes spraying neem oil, using copper sprays, introducing compost tea, and practicing crop rotation to maintain soil health.";
        }
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/20 rounded-lg">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">AgriVision Assistant</h4>
                <p className="text-[10px] text-white/80">Online & Ready</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/40">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick FAQ Options */}
          <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto shrink-0">
            {FAQ_DATABASE.map((faq, i) => (
              <button
                key={i}
                onClick={() => handleSend(faq.question)}
                className="text-[10px] bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-full px-2.5 py-1 transition-all cursor-pointer truncate max-w-full text-left"
              >
                {faq.question}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask me a question..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-600/10 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center relative group"
        title="AgriVision Help Chat"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute right-14 bg-slate-900 text-white text-[10px] font-bold rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          Crop Assistant Chat
        </span>
      </button>
    </div>
  );
}
