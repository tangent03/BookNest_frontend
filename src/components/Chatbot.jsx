import React, { useEffect, useRef, useState } from 'react';
import './styles/Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Hello! Welcome to BookNest. I\'m your virtual assistant. How can I help you today?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Auto open the chat after 5 seconds if user hasn't interacted
        const timer = setTimeout(() => {
            if (messages.length === 1) {
                setIsOpen(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [messages]);

    // Quick reply suggestions
    const suggestions = [
        { id: 1, text: "How do I place an order?" },
        { id: 2, text: "What genres do you offer?" },
        { id: 3, text: "Return policy" },
        { id: 4, text: "Shipping information" },
        { id: 5, text: "I need help finding a book" }
    ];

    const getBotResponse = (userMessage) => {
        // Convert to lowercase for easier matching
        const message = userMessage.toLowerCase();
        
        // Check for keywords to determine response
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello there! How can I assist you with your book shopping today?";
        } 
        else if (message.includes('order') || message.includes('place an order')) {
            return "To place an order, simply browse our collection, add books to your cart, and proceed to checkout. You'll need to create an account or log in if you haven't already. Need more specific help with ordering?";
        }
        else if (message.includes('genre') || message.includes('categories')) {
            return "We offer a wide range of genres including Fiction, Non-Fiction, Mystery, Science Fiction, Fantasy, Biography, History, Self-Help, and Children's books. You can find these categories in our navigation menu. Is there a specific genre you're interested in?";
        }
        else if (message.includes('return') || message.includes('return policy')) {
            return "Our return policy allows returns within 30 days of purchase. Books must be in original condition. Please contact our customer service with your order number to initiate a return.";
        }
        else if (message.includes('shipping') || message.includes('delivery')) {
            return "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and international shipping (7-14 business days). Shipping costs are calculated at checkout based on your location and order weight.";
        }
        else if (message.includes('find') || message.includes('finding a book') || message.includes('search')) {
            return "You can search for books using the search bar at the top of our website. You can search by title, author, or ISBN. You can also browse by genre using our category menu. Would you like me to recommend some popular books?";
        }
        else if (message.includes('account') || message.includes('login') || message.includes('sign up')) {
            return "You can create an account or login using the buttons in the top right corner of the website. An account allows you to track orders, save payment methods, and create wishlists.";
        }
        else if (message.includes('payment') || message.includes('pay')) {
            return "We accept credit/debit cards, PayPal, and gift cards. All payments are securely processed and your information is never stored on our servers.";
        }
        else if (message.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        else if (message.includes('bye') || message.includes('goodbye')) {
            return "Thank you for chatting with BookNest Assistant. Have a great day and happy reading!";
        }
        else {
            return "I'm not sure I understand. Could you please rephrase or choose from one of the suggested topics below? Alternatively, you can email our support team at support@booknest.com for more complex inquiries.";
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    const handleSend = (messageText) => {
        if (!messageText.trim()) return;

        const userMessage = {
            type: 'user',
            content: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setShowSuggestions(false);
        setIsTyping(true);

        // Simulate bot "typing" with random delay for natural feel
        const typingDelay = 1000 + Math.random() * 1500;
        
        setTimeout(() => {
            const botResponse = {
                type: 'bot',
                content: getBotResponse(messageText),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
            
            // Show suggestions again after bot responds
            setTimeout(() => {
                setShowSuggestions(true);
            }, 500);
        }, typingDelay);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSend(inputMessage);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        // Focus input when opening
                        setTimeout(() => inputRef.current?.focus(), 100);
                    }
                }}
                className="btn bg-secondary hover:bg-secondary-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-none transition-all duration-300"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {/* Notification dot when closed */}
            {!isOpen && messages.length === 1 && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 h-[32rem] bg-slate-950 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-800 animate-slideUp">
                    {/* Header */}
                    <div className="p-4 bg-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="text-xl">📚</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">BookNest Assistant</h3>
                            <p className="text-sm text-white/80">Your Literary Guide</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.type === 'bot' && (
                                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mr-2">
                                        <span className="text-sm">📚</span>
                                    </div>
                                )}
                                <div
                                    className={`p-3 rounded-lg mb-2 max-w-[80%] ${
                                        message.type === 'user'
                                            ? 'bg-secondary text-white rounded-tr-none'
                                            : 'bg-slate-800 text-white rounded-tl-none'
                                    } shadow-md`}
                                >
                                    <div className="mb-1">{message.content}</div>
                                    <div className="text-xs opacity-70 text-right">{message.timestamp}</div>
                                </div>
                                {message.type === 'user' && (
                                    <div className="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-sm">📚</span>
                                </div>
                                <div className="p-3 rounded-lg mb-2 bg-slate-800 text-white rounded-tl-none shadow-md">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Quick Replies */}
                        {showSuggestions && messages.length > 0 && !isTyping && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-400 mb-2">Suggested topics:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map(suggestion => (
                                        <button
                                            key={suggestion.id}
                                            onClick={() => handleSuggestionClick(suggestion.text)}
                                            className="bg-slate-800 text-white text-sm px-3 py-1 rounded-full hover:bg-slate-700 transition-colors"
                                        >
                                            {suggestion.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 rounded-full bg-slate-800 focus:ring-2 focus:ring-secondary border-none text-gray-200 placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="btn bg-secondary hover:bg-secondary-700 text-white rounded-full w-10 h-10 flex items-center justify-center border-none"
                                disabled={!inputMessage.trim()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;

