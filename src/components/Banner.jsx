import React from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../assets/Banner.png';

const Banner = () => {
    return (
        <div className="bg-slate-950">
            <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="text-center lg:text-left space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                            Welcome to <span className="text-secondary">BookNest</span>
                        </h1>
                        <p className="text-lg text-gray-300">
                            Discover a world of knowledge and adventure through our carefully curated collection of books.
                            From timeless classics to contemporary bestsellers, find your next literary journey with us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/course"
                                className="bg-secondary hover:bg-secondary-600 text-white px-8 py-3 rounded-md font-medium transition duration-300"
                            >
                                Explore Books
                            </Link>
                            <Link
                                to="/about"
                                className="bg-slate-900 text-secondary hover:bg-secondary/10 px-8 py-3 rounded-md font-medium transition duration-300 border border-secondary"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src={bannerImage}
                            alt="Books Banner"
                            className="w-full h-auto rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
