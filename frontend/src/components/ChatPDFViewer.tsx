import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, RotateCcw, User, Bot, Quote } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citation?: string;
  excerpt?: string;
}

interface ChatPDFViewerProps {
  fileName: string;
  onSendQuery: (question: string) => Promise<{ answer: string; citation?: string; excerpt?: string }>;
}

export const ChatPDFViewer: React.FC<ChatPDFViewerProps> = ({ fileName, onSendQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      sender: 'assistant',
      text: `Hello! I've indexed "${fileName}". What would you like to know about this document? Ask me for summaries, specific figures, dates, or key findings!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userQuestion = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userQuestion,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await onSendQuery(userQuestion);
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: res.answer,
        citation: res.citation,
        excerpt: res.excerpt,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          text: 'Sorry, I encountered an issue analyzing that question. Please try asking in a different way.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'initial',
        sender: 'assistant',
        text: `Conversation reset. Ask another question about "${fileName}".`,
      },
    ]);
  };

  return (
    <div className="w-full h-[520px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Chat with Document</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-xs">{fileName}</p>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <p>{msg.text}</p>

              {msg.citation && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 dark:text-electric-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Reference: {msg.citation}</span>
                </div>
              )}

              {msg.excerpt && (
                <div className="mt-1 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 text-[10px] text-slate-700 dark:text-slate-300 italic flex items-start gap-1">
                  <Quote className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>"{msg.excerpt}"</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Analyzing document context...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this PDF..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
