import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../game/sound';

const QUICK_REACTIONS = ['😂', '😡', '🎉', '👍', 'GG', '🔥', '👑', '😱'];

export default function Chat({
  messages = [],
  onSendMessage,
  currentUserColor = 'red',
  currentUserName = 'You',
}) {
  const [input, setInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sound.playClick();
    onSendMessage(input.trim());
    setInput('');
  };

  const handleQuickReaction = (reaction) => {
    sound.playClick();
    onSendMessage(reaction);
  };

  return (
    <div className="flex flex-col rounded-2xl glass-panel-elevated overflow-hidden border border-slate-800/80 w-full h-[360px] sm:h-[400px]">
      {/* Header */}
      <div className="px-3 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Arena Chat
          </span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded-full">
            {messages.length}
          </span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
        {messages.map((msg) => {
          const isSystem = msg.sender === 'System';
          const isMe = msg.sender === currentUserName;

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-1.5">
                <span className="inline-block bg-slate-900/60 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-800">
                  {msg.text}
                </span>
              </div>
            );
          }

          const colorText = {
            red: 'text-red-400',
            green: 'text-emerald-400',
            yellow: 'text-amber-300',
            blue: 'text-blue-400',
            accent: 'text-purple-400',
          }[msg.color] || 'text-purple-400';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-[10px] font-bold ${colorText}`}>
                  {msg.sender}
                </span>
                <span className="text-[9px] text-slate-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={`
                  px-2.5 py-1.5 rounded-xl max-w-[85%] break-words
                  ${
                    isMe
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions Bar */}
      <div className="px-2 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleQuickReaction(emoji)}
            className="p-1 rounded-lg hover:bg-slate-800 active:scale-90 text-sm transition-all"
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Text Input */}
      <form onSubmit={handleSubmit} className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          maxLength={120}
          className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-1.5 rounded-xl bg-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
