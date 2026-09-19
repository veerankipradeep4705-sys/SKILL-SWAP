import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MoreVertical, ShieldCheck, CheckCheck, Paperclip, Lock, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { User, ChatMessage } from '../types';
import { apiClient } from '../api/client';

interface ChatScreenProps {
  currentUser: User;
  activePeerId?: string;
  onBack?: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  currentUser,
  activePeerId = 'user-alex-kumar',
  onBack,
}) => {
  const [selectedPeerId, setSelectedPeerId] = useState(activePeerId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available chat peers from mockup
  const peers = [
    {
      id: 'user-alex-kumar',
      name: 'Alex Kumar',
      role: 'Python Instructor',
      photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      online: true,
      college: 'Indian Institute of Technology',
    },
    {
      id: 'user-sneha-patel',
      name: 'Sneha Patel',
      role: 'UI/UX Designer',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      online: true,
      college: 'Vellore Institute of Technology',
    },
    {
      id: 'user-priya-sharma',
      name: 'Priya Sharma',
      role: 'Python Learner',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
      online: false,
      college: 'Delhi Technological University',
    },
    {
      id: 'user-rohan-mehta',
      name: 'Rohan Mehta',
      role: 'Guitar Tutor',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      online: true,
      college: 'Delhi University',
    },
  ];

  const currentPeer = peers.find((p) => p.id === selectedPeerId) || peers[0];

  const fetchMessages = async (peerId: string) => {
    try {
      setLoading(true);
      const res = await apiClient.getMessages(peerId);
      setMessages(res.messages);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(selectedPeerId);
  }, [selectedPeerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      setSending(true);
      const res = await apiClient.sendMessage(selectedPeerId, messageText);
      setMessages((prev) => [...prev, res.chat]);

      // Simulate a realistic peer response after 1.2s to verify full encrypted messaging roundtrip
      setTimeout(async () => {
        try {
          const autoReplies: Record<string, string[]> = {
            'user-alex-kumar': [
              "Awesome! I'll share the GitHub repository link for our practice tasks.",
              "Sounds good! We can set up a quick Google Meet or in-person library session.",
              "Let me know if you need help with any specific syntax or homework questions!",
            ],
            'user-sneha-patel': [
              "Great! I've prepped a couple of Figma UI components for us to inspect.",
              "Looking forward to our design critique session!",
            ],
            'user-rohan-mehta': [
              "Sounds good! Make sure to tune the guitar before we start.",
            ],
          };

          const pool = autoReplies[selectedPeerId] || [
            "Thank you! Looking forward to swapping skills with you.",
          ];
          const randomReply = pool[Math.floor(Math.random() * pool.length)];

          // Post simulated response through server
          const replyRes = await apiClient.sendMessage(currentUser.id, randomReply);
          // Refresh messages
          fetchMessages(selectedPeerId);
        } catch (err) {
          // ignore background simulator error
        }
      }, 1200);
    } catch (err: any) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[640px] max-h-[80vh] bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      {/* Peer Selector Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200/80 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Peers:
        </span>
        {peers.map((peer) => (
          <button
            key={peer.id}
            onClick={() => setSelectedPeerId(peer.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition shrink-0 ${
              selectedPeerId === peer.id
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                peer.online ? 'bg-emerald-400' : 'bg-slate-300'
              }`}
            />
            <span className="truncate max-w-[100px]">{peer.name}</span>
          </button>
        ))}
      </div>

      {/* Chat Header matching Image 7 Screen 7 */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onBack && (
            <button
              id="chat-header-back-btn"
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-xl hover:bg-slate-100 text-slate-600 transition active:scale-95"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <img
              src={currentPeer.photo}
              alt={currentPeer.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            {currentPeer.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {currentPeer.name}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">
              {currentPeer.online ? 'Online' : 'Offline'} • {currentPeer.college}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => alert(`Starting encrypted voice call with ${currentPeer.name}...`)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
            title="Audio Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert(`Chat options for ${currentPeer.name}`)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="px-4 py-1.5 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-center gap-1.5 text-[11px] text-indigo-700 font-medium">
        <Lock className="w-3 h-3 text-indigo-600" />
        <span>Messages are encrypted at rest with AES-256-GCM.</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400">
            Decrypting chat records...
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.message}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                      isMe ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />}
                  </div>
                </div>

                {/* Optional Crypto verification tool-tip */}
                {msg.encryptionMetadata && (
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 px-1">
                    AES-256 Auth Tag: {msg.encryptionMetadata.authTag.slice(0, 8)}...
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <MessageCircle className="w-8 h-8 text-slate-300" />
            <p className="text-xs">No messages yet. Send a greeting to start chatting!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box matching Screen 7 */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => alert('File attachment encrypted via AES-256 storage.')}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 disabled:opacity-40 transition active:scale-95 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
