import React, { useState } from 'react';
import axios from 'axios';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SV-1500 Quantum Core Online. Connected to Render Engine. I am your active PropTech Underwriter. Awaiting instructions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // THE APEX FIX: Hardwired directly to the live Render Engine.
      const apiUrl = 'https://rodney-vault-api.onrender.com';
      
      const res = await axios.post(`${apiUrl}/api/ai-analyze`, {
        prompt: userMsg
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'SYSTEM ERROR: Connection to Python Engine failed.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-['Inter_Tight',sans-serif]">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Quantum Core</h1>
        <p className="text-[#80DEEA] text-sm tracking-widest uppercase font-bold">SV-1500 Underwriting AI Active</p>
      </div>

      <div className="smoky-glass rounded-2xl border border-white/10 flex flex-col h-[600px] overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#80DEEA]/5 blur-[100px] pointer-events-none"></div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-5 rounded-xl text-sm font-bold tracking-wide leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white text-black rounded-tr-none' 
                  : 'bg-black/50 border border-[#80DEEA]/30 text-gray-300 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' && <span className="text-[#80DEEA] text-[10px] uppercase tracking-widest block mb-2">SV-1500 System</span>}
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-black/50 border border-[#80DEEA]/30 text-[#80DEEA] p-4 rounded-xl rounded-tl-none text-xs font-black uppercase tracking-widest animate-pulse">
                Analyzing Live Market Data...
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-white/10 bg-black/40 relative z-10">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the Quantum Core to analyze a property..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#80DEEA]/50 transition-all text-sm font-bold"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-white text-black px-8 py-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
            >
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}