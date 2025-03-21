import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-950 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">Discover our story and mission to provide quality education through our comprehensive book collection.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="card bg-slate-900 shadow-xl border border-slate-800">
                        <div className="card-body">
                            <h3 className="card-title text-secondary">📚 Vast Collection</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Access thousands of books across multiple genres, from classics to contemporary bestsellers.
                            </p>
                        </div>
                    </div>
                    <div className="card bg-slate-900 shadow-xl border border-slate-800">
                        <div className="card-body">
                            <h3 className="card-title text-secondary">🌟 Expert Curation</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Our team of literary experts carefully curates collections to help you discover your next favorite book.
                            </p>
                        </div>
                    </div>
                    <div className="card bg-slate-900 shadow-xl border border-slate-800">
                        <div className="card-body">
                            <h3 className="card-title text-secondary">💫 Community</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Join a vibrant community of book lovers, share reviews, and participate in reading challenges.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Our Team</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">Meet the dedicated professionals behind BookNest.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card bg-slate-900 shadow-xl border border-slate-800">
                        <div className="card-body items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                <span className="text-4xl">👩‍💼</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Sarah Johnson</h3>
                            <p className="text-secondary">Founder & CEO</p>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Book enthusiast with 15 years in publishing
                            </p>
                        </div>
                    </div>
                    <div className="card bg-slate-900 shadow-xl border border-slate-800">
                        <div className="card-body items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                <span className="text-4xl">👨‍💻</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Michael Chen</h3>
                            <p className="text-secondary">Head of Technology</p>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Tech innovator with a passion for books
                            </p>
                        </div>
                    </div>
                    <div className="card bg-slate-900 shadow-xl border border-slate-800">
                        <div className="card-body items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                <span className="text-4xl">👩‍🎨</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Emma Davis</h3>
                            <p className="text-secondary">Creative Director</p>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Designer and storyteller extraordinaire
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 