/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { queryAiAssistant } from '../api.js';
import { ChatMessage, ScanResult } from '../types.js';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Clock, 
  FileWarning, 
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface AiSecurityAssistantProps {
  currentScanContext: ScanResult | null;
}

export default function AiSecurityAssistant({ currentScanContext }: AiSecurityAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: "👋 Hello, I am your senior SOC Cybersecurity AI Analyst. Ask me anything about phishing campaigns, URL structures, suspicious entropy scores, SSL validation checks, or how to mitigate active web incidents.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat body
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    const userText = userInput.trim();
    setUserInput('');
    setError(null);

    const userMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
      scannedUrlContext: currentScanContext?.url
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await queryAiAssistant(userText, messages, currentScanContext);
      
      const botMsg: ChatMessage = {
        id: `chat_${Date.now() + 1}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setError(err.message || 'Failed to reach AI security gateway.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init_1',
        sender: 'assistant',
        text: "👋 Chat container re-initialized. Prompt me to review URL properties or explain threat intelligence signatures.",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]" id="chatbot-assistant-module">
      {/* Active contextual sidebar */}
      <div className="lg:col-span-1 p-5 bg-slate-900/30 border border-slate-800 rounded-lg flex flex-col justify-between shadow-md h-full">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="block text-[10px] font-mono text-slate-500 uppercase">AI ANALYST INSIGHT</span>
            <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
              <Bot className="h-4 w-4" />
              CONCURRENT THREAT FOCUS
            </h3>
          </div>

          {currentScanContext ? (
            <div className="space-y-3 font-mono text-xs animate-fadeIn">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded">
                <span className="text-[10px] text-slate-500 block">CURRENT CONTEXT TARGET</span>
                <span className="text-slate-300 font-semibold truncate block mt-0.5" title={currentScanContext.url}>
                  {currentScanContext.url}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-950 border border-slate-850 rounded">
                  <span className="text-[9px] text-slate-500 block">CLASSIFIER</span>
                  <span className={`font-bold mt-0.5 block ${currentScanContext.securityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {currentScanContext.prediction}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-850 rounded">
                  <span className="text-[9px] text-slate-500 block">SCORE</span>
                  <span className="text-white font-bold mt-0.5 block">
                    {currentScanContext.securityScore}/100
                  </span>
                </div>
              </div>

              <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded flex items-start gap-2 text-rose-400/90 text-[11px] leading-relaxed">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Ask: &quot;Why was this URL flagged?&quot; or &quot;How do I configure a snort/suricata IDS rule for this domain?&quot;</span>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-800 rounded bg-slate-950/25 text-center font-mono text-[11px] text-slate-650">
              No URL currently scanned. Run an active scan in the Scanner menu to pass threat indicators to the chatbot.
            </div>
          )}
        </div>

        <button 
          onClick={clearChat}
          className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs font-mono text-slate-500 hover:text-slate-300 flex items-center justify-center gap-2 rounded transition-all cursor-pointer active:scale-[0.98]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          CLEAR CONVERSATION LOGS
        </button>
      </div>

      {/* Main interactive Chat console */}
      <div className="lg:col-span-2 border border-slate-800 rounded-lg bg-slate-950/60 flex flex-col h-full overflow-hidden relative shadow-lg">
        {/* Chat top info header */}
        <div className="bg-slate-900 border-b border-slate-850 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider">AI ASSISTANT (GEMINI CO-PILOT)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Heuristic Engine Sync Active</span>
        </div>

        {/* Chat Messages Log Container */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Visual Avatar */}
                <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${isBot ? 'bg-cyan-950/80 border-cyan-500/20 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message bubble */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-lg whitespace-pre-line border ${isBot ? 'bg-slate-900/50 border-slate-850 text-slate-300' : 'bg-cyan-950/20 border-cyan-500/20 text-cyan-200'}`}>
                    {msg.text}
                  </div>
                  {msg.scannedUrlContext && (
                    <div className="text-[9px] text-slate-500 font-mono italic px-1">
                      Context: {msg.scannedUrlContext}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Response thinking loaders */}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded border bg-cyan-950/80 border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-850 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                <span className="text-[10px] font-mono text-slate-500 uppercase ml-2">Deconstructing Threat Vectors...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded flex items-center gap-2">
              <FileWarning className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Input Chat form */}
        <form onSubmit={handleSend} className="bg-slate-900 border-t border-slate-850 p-3 flex gap-2">
          <input
            type="text"
            id="chat-input"
            className="flex-1 bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded text-xs text-white font-mono focus:outline-none focus:border-cyan-500 placeholder-slate-600"
            placeholder={currentScanContext ? "e.g. Why was this URL flagged? Or ask any SOC prompt..." : "Ask general security questions..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            id="chat-submit"
            disabled={loading || !userInput.trim()}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
          >
            <Send className="h-3 w-3" />
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}
