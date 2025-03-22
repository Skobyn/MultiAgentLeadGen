import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I\'m your Lead Generation Assistant. I can help you find and qualify leads, create search queries, and manage your lead generation workflow. How can I assist you today?',
    sender: 'bot',
    timestamp: new Date(),
  },
];

// Sample suggested prompts
const suggestedPrompts = [
  'Find tech CTOs in San Francisco',
  'Create a list of marketing directors at e-commerce companies',
  'How many leads did we generate last month?',
  'Analyze the performance of my latest email campaign',
  'Help me craft a personalized outreach template',
];

const ChatbotInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sample function to handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: simulateResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // For demo purposes - simulate a response based on user input
  const simulateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! How can I assist with your lead generation needs today?';
    }
    
    if (input.includes('find') || input.includes('search') || input.includes('look for')) {
      return 'I can help you search for leads. Would you like me to create a search query based on specific criteria like job title, location, or company size?';
    }
    
    if (input.includes('email') || input.includes('campaign')) {
      return 'Would you like me to help you with email campaign creation, analysis, or lead follow-up sequences?';
    }
    
    if (input.includes('performance') || input.includes('analytics')) {
      return 'I can analyze your lead generation performance. Would you like to see metrics on lead quality, conversion rates, or source effectiveness?';
    }
    
    return 'I understand you\'re asking about "' + userInput + '". To better assist you, could you provide more specific details about your lead generation needs?';
  };

  // Handle suggested prompt click
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">AI Chatbot Assistant</h1>
        <p className="mt-1 text-sm text-gray-500">
          Interact with your AI assistant to manage lead generation tasks
        </p>
      </div>

      <div className="flex flex-col flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Chat header */}
        <div className="bg-primary-700 px-4 py-3 flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-xl text-white">🤖</span>
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">Lead Gen Assistant</p>
            <p className="text-primary-200 text-sm">AI-powered helper</p>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              className="form-input flex-1 resize-none border-gray-300 rounded-md focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              rows={1}
            />
            <div className="ml-3 flex space-x-2">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 border border-transparent rounded-full shadow-sm text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                <MicrophoneIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleSendMessage}
                className="inline-flex items-center justify-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface;