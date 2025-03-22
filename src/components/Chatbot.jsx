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
            return "Hello there! 👋 I'm your BookNest assistant. How can I make your book shopping experience better today? Feel free to ask about our collection, promotions, or anything book-related!";
        } 
        else if (message.includes('order') || message.includes('place an order')) {
            return "📚 Ordering is simple! Browse our collection, add books to your cart, and proceed to checkout. You'll need an account to complete your purchase. We offer secure payment options and fast shipping. Need help with a specific part of the ordering process?";
        }
        else if (message.includes('genre') || message.includes('categories')) {
            return "📖 At BookNest, we pride ourselves on our diverse collection! We offer Fiction, Non-Fiction, Mystery, Science Fiction, Fantasy, Biography, History, Self-Help, Children's books, and many more. Each category is carefully curated with bestsellers and hidden gems. Which genre interests you most?";
        }
        else if (message.includes('return') || message.includes('return policy')) {
            return "🔄 Our customer-friendly return policy allows returns within 30 days of purchase. Books must be in their original condition with no damage. Simply contact our customer service team with your order number, and we'll guide you through the process. We aim to process refunds within 5-7 business days.";
        }
        else if (message.includes('shipping') || message.includes('delivery')) {
            return "🚚 We offer flexible shipping options to meet your needs:\n• Standard: 3-5 business days ($3.99 or free over $35)\n• Express: 1-2 business days ($7.99)\n• International: 7-14 business days (varies by location)\n\nTracking information is provided via email once your order ships. Would you like to know about any current shipping promotions?";
        }
        else if (message.includes('find') || message.includes('finding a book') || message.includes('search')) {
            return "🔍 Finding your next great read is easy! Use our search bar at the top to look up titles, authors, or ISBN numbers. You can also browse by genre, new releases, or bestsellers. Our advanced filters help narrow down by price range, format, and reader ratings. Would you like me to recommend some titles based on your interests?";
        }
        else if (message.includes('account') || message.includes('login') || message.includes('sign up')) {
            return "👤 Creating an account with BookNest gives you access to exclusive benefits! You can track orders, save payment methods, create wishlists, and receive personalized recommendations. Plus, members get early access to sales and special promotions. Sign up takes less than a minute - just click the account icon in the top right corner!";
        }
        else if (message.includes('payment') || message.includes('pay')) {
            return "💳 We accept multiple secure payment methods for your convenience:\n• Credit/debit cards (Visa, Mastercard, Amex)\n• PayPal\n• Gift cards\n• Apple Pay/Google Pay\n\nAll transactions are encrypted and we never store your complete payment information. If you have any issues with payment, our customer service team is ready to help!";
        }
        else if (message.includes('discount') || message.includes('coupon') || message.includes('promo')) {
            return "🏷️ Great timing! We currently have several promotions running:\n• 15% off your first order with code WELCOME15\n• Buy 2 get 1 free on selected titles\n• Free shipping on orders over $35\n• Student discount of 10% with verification\n\nYou can apply these at checkout. Would you like me to tell you about our rewards program too?";
        }
        else if (message.includes('bestseller') || message.includes('popular') || message.includes('recommend')) {
            return "📚 Our current bestsellers include:\n• 'The Midnight Library' by Matt Haig\n• 'Atomic Habits' by James Clear\n• 'The Seven Husbands of Evelyn Hugo' by Taylor Jenkins Reid\n• 'Project Hail Mary' by Andy Weir\n\nBased on your interest, I'd be happy to recommend more titles in specific genres!";
        }
        else if (message.includes('thank')) {
            return "You're very welcome! 😊 I'm delighted to help make your BookNest experience better. Is there anything else you'd like to know about our services or collection? Happy reading!";
        }
        else if (message.includes('bye') || message.includes('goodbye')) {
            return "Thank you for chatting with BookNest Assistant! 📚 Have a wonderful day and happy reading! If you need anything else, I'll be here when you return. Don't forget to check out our latest arrivals!";
        }
        else {
            return "I'm not quite sure I understand what you're looking for. Could you please rephrase your question, or select one of the suggested topics below? For more complex inquiries, you can also reach our support team at support@booknest.com - we typically respond within 24 hours.";
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

