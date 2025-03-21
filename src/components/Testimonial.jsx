import React from 'react';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Book Enthusiast",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        quote: "BookNest has transformed my reading experience. The collection is diverse and the service is exceptional!",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Literature Professor",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        quote: "As an educator, I appreciate the quality and variety of books available. It's my go-to platform for academic and leisure reading.",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Student",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        quote: "The prices are student-friendly and the delivery is always on time. Couldn't ask for a better bookstore!",
    }
];

const Testimonial = () => {
    return (
        <section className="bg-slate-950 py-16">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        What Our Readers Say
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Discover why book lovers choose BookNest for their reading journey
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-slate-900 p-6 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 border border-slate-800"
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-secondary">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                            <blockquote>
                                <p className="text-gray-300 italic">
                                    "{testimonial.quote}"
                                </p>
                            </blockquote>
                            <div className="mt-4 flex justify-start">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-secondary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonial; 