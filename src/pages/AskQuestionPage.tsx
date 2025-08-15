import React, { useState } from 'react';
import { ChevronLeft, Plus, User, Bot, Send, Sparkles, HelpCircle, ArrowUp } from 'lucide-react';

const AskQuestionPage = () => {
  // Mock router functions since we don't have react-router-dom
  const navigate = (path) => console.log('Navigate to:', path);
  const productId = 'sample-product-123';
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question) => {
    const responses = [
      "That's a great question! Based on the product details, here are some optimized ways to ask:\n\n• **Compatibility question**: \"Is this product compatible with [specific device/model]?\"\n• **Technical specs**: \"What are the exact dimensions and technical specifications?\"\n• **Usage scenarios**: \"How well does this work for [your specific use case]?\"\n\nWould you like me to help you refine your question further?",

      "I can help you structure that question better! Here are some suggestions:\n\n• Be more specific about your requirements\n• Include your device model or setup\n• Mention your intended use case\n• Ask about potential limitations\n\nFor example, instead of asking generally, you could ask: \"Does this work reliably with [your specific setup] for [your intended use]?\"",

      "Great question! Let me suggest some refined versions:\n\n• **For compatibility**: \"Is this fully compatible with [specific model/version]?\"\n• **For performance**: \"What's the real-world performance like for [specific task]?\"\n• **For durability**: \"How does this hold up with regular use over time?\"\n\nThese focused questions typically get better, more detailed answers from sellers and other customers."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white absolute top-0 left-0 right-0 z-10 border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Ask a Question</h1>
        <button 
          onClick={() => console.log('Help clicked')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pt-20 pb-20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ask Question Assistant</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Describe what you want to know about this product, and I'll help you craft the perfect question to get the best answers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              <button 
                onClick={() => setInputMessage("I want to know about compatibility")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900 mb-1">Check compatibility</div>
                <div className="text-sm text-gray-600">Ask about device or system compatibility</div>
              </button>
              <button 
                onClick={() => setInputMessage("I want to know about performance")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900 mb-1">Performance questions</div>
                <div className="text-sm text-gray-600">Ask about speed, battery, or efficiency</div>
              </button>
              <button 
                onClick={() => setInputMessage("I want to know about durability")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900 mb-1">Durability & quality</div>
                <div className="text-sm text-gray-600">Ask about build quality and longevity</div>
              </button>
              <button 
                onClick={() => setInputMessage("I want to know what's included")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900 mb-1">What's included</div>
                <div className="text-sm text-gray-600">Ask about package contents and accessories</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-4 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* Message Content */}
                <div className={`max-w-xs ${message.type === 'user' ? 'order-1' : 'order-1'}`}>
                  <div className={`max-w-none ${
                    message.type === 'user' 
                      ? 'bg-gray-100 text-gray-900 rounded-xl p-3 ml-auto' 
                      : 'text-gray-900'
                  }`}>
                    {message.type === 'assistant' ? (
                      <div dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/• (.*?)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 mt-0.5">•</span><span>$1</span></div>')
                          .replace(/\n\n/g, '<div class="my-3"></div>')
                          .replace(/\n/g, '<br>')
                      }} />
                    ) : (
                      <span>{message.content}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs">
                  <div className="text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm ml-2">Analyzing your question...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white z-10 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping}
              className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 bg-gray-200 hover:bg-gray-300 text-orange-500 rounded-full flex items-center justify-center transition-colors"
            >
              {inputMessage.trim() ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;