import React, { useState, useRef } from 'react';

export default function ApexChatInput({ onTransmit, isProcessing }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitQuery();
    }
  };

  const submitQuery = () => {
    if (!text.trim() || isProcessing) return;
    onTransmit(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="flex items-end gap-3 p-3 bg-[#0a0e17] border border-[#1e293b] rounded-lg shadow-2xl">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Draft your query here... (Review text freely, Ctrl+Enter to send)"
        rows={1}
        className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none max-h-[150px] overflow-y-auto leading-relaxed px-1 py-1"
      />
      <button
        onClick={submitQuery}
        disabled={isProcessing || !text.trim()}
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-semibold text-xs tracking-wider uppercase rounded transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(8,145,178,0.4)]"
      >
        {isProcessing ? 'Processing...' : 'Transmit'}
      </button>
    </div>
  );
}