import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Send, Bot, User, Stethoscope, Star, Calendar, AlertTriangle } from 'lucide-react';

export default function ChatAgent() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your Medical AI Assistant 🤖🩺\nI can help you find the right doctor, answer general health inquiries, or book an appointment.\n\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickQuestions = [
    "Which doctor do I need for a headache?",
    "I want to book an appointment",
    "What are your working hours?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Real AI response logic
    const fetchAIResponse = async () => {
      try {
        const response = await axios.post('http://localhost:8009/ai/diagnose', {
          message: text,
          user_id: 'anonymous'
        });

        const data = response.data;

        let aiText = "";
        if (data.analysis) {
          const { analysis, mapped_specialty } = data;

          if (analysis.possible_conditions?.length > 0) {
            aiText += `**Possible Conditions:** ${analysis.possible_conditions.join(', ')}\n`;
          }
          aiText += `**Risk Level:** ${analysis.risk_level?.toUpperCase()}\n\n`;
          aiText += `**Advice:** ${analysis.advice}\n\n`;
          aiText += `**Recommended Specialist:** ${mapped_specialty}`;
        } else {
          aiText = "I'm sorry, I couldn't process your request. Please try again.";
        }

        const newAiMsg = {
          id: messages.length + 2,
          sender: 'ai',
          text: aiText,
          analysisData: data.analysis,
          recommendedDoctors: data.recommended_doctors || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newAiMsg]);
      } catch (err) {
        console.error("AI Agent Error:", err);
        const errorMsg = {
          id: messages.length + 2,
          sender: 'ai',
          text: "I'm having trouble connecting to my knowledge base. Please make sure the system is online.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchAIResponse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcfc] to-[#e6f4f4] font-sans flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/doctors')}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e6262]/10 text-[#1e6262]">
                  <Bot size={24} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="font-bold text-gray-800 leading-tight">Clinique AI Assistant</h1>
                <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </p>
              </div>
            </div>
          </div>
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-[#1e6262] transition-colors">
            Clinique
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-4xl mx-auto space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-[#1e6262]/10 max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-[#1e6262]/10 text-[#1e6262] rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to your Medical Assistant</h2>
          <p className="text-sm text-gray-500">I am an AI designed to guide you through our clinic services. I do not provide official medical diagnoses.</p>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
              
              {/* Avatar */}
              <div className="shrink-0 mt-auto">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${msg.sender === 'ai' ? 'bg-[#1e6262] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${
                  msg.sender === 'ai' 
                    ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100' 
                    : 'bg-[#1e6262] text-white rounded-br-none'
                }`}>
                  {msg.text.split('\n').map((line, i) => {
                    if (line.startsWith('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i} className="mb-1">
                          <span className="font-bold text-[#1e6262]">{parts[1]}</span>
                          {parts[2]}
                        </p>
                      );
                    }
                    return <p key={i} className="mb-1">{line}</p>;
                  })}
                  {msg.analysisData && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        msg.analysisData.risk_level === 'high' ? 'bg-red-100 text-red-600' :
                        msg.analysisData.risk_level === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {msg.analysisData.risk_level} risk
                      </span>
                    </div>
                  )}
                </div>

                {/* Recommended Doctors Cards */}
                {msg.recommendedDoctors?.length > 0 && (
                  <div className="mt-3 w-full space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                      Recommended Specialists
                    </p>
                    {msg.recommendedDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white border border-[#1e6262]/15 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-[#1e6262]/30 transition-all"
                      >
                        {doc.imageUrl ? (
                          <img
                            src={doc.imageUrl}
                            alt={doc.lastName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 ring-2 ring-[#ecfffb]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-sm shrink-0">
                            {doc.firstName?.[0]}{doc.lastName?.[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">
                            Dr. {doc.firstName} {doc.lastName}
                          </p>
                          <p className="text-xs text-[#2d767f] font-semibold">{doc.speciality}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {doc.rating && (
                              <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                                <Star size={10} className="fill-amber-400 stroke-amber-400" />
                                {doc.rating}
                              </span>
                            )}
                            {doc.experience && (
                              <span className="text-[10px] text-gray-400">{doc.experience}</span>
                            )}
                          </div>
                        </div>
                        <Link
                          to={`/doctors/${doc.id}`}
                          className="shrink-0 flex items-center gap-1 bg-[#1e6262] hover:bg-[#154646] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                        >
                          <Calendar size={12} />
                          Book
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback when no matching doctors found */}
                {msg.recommendedDoctors?.length === 0 && msg.analysisData && (
                  <div className="mt-2 px-1">
                    <Link
                      to="/doctors"
                      className="text-xs text-[#1e6262] font-bold hover:underline flex items-center gap-1"
                    >
                      <Stethoscope size={12} />
                      Browse all available specialists →
                    </Link>
                  </div>
                )}

                <span className="text-[10px] text-gray-400 font-medium px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] sm:max-w-[75%] animate-in fade-in">
              <div className="shrink-0 mt-auto">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e6262] text-white">
                  <Bot size={16} />
                </div>
              </div>
              <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/60 p-4 sticky bottom-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Quick Questions */}
          <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 bg-white border border-[#1e6262]/20 hover:bg-[#1e6262]/5 text-[#1e6262] text-xs font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="relative flex items-end gap-2 bg-white rounded-3xl p-2 shadow-sm border border-gray-200 focus-within:border-[#1e6262] focus-within:ring-2 focus-within:ring-[#1e6262]/20 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask me anything about our clinic..."
              className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none py-3 px-4 text-sm text-gray-800 placeholder-gray-400"
              rows={1}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="shrink-0 h-11 w-11 flex items-center justify-center bg-[#1e6262] hover:bg-[#154646] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full transition-colors shadow-md"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
          <div className="text-center text-[10px] text-gray-400 font-medium">
            AI can make mistakes. Please verify important medical information.
          </div>
        </div>
      </footer>
    </div>
  );
}

// iyadh: doctor cards
