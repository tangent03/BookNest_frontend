import React, { useEffect, useState } from 'react';

const reviewData = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Book Enthusiast",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    comment: "BookStore has completely transformed my reading experience. The selection is incredible, and the recommendations are always spot-on. The user interface is intuitive, and the delivery is always prompt!"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Literature Professor",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
    comment: "As an educator, I appreciate BookStore's commitment to quality literature and education. Their recommendations are spot-on, and the website makes it easy to find exactly what I'm looking for."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Book Club Organizer",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 4,
    comment: "Our book club relies on BookStore for our monthly selections. The diversity of genres and thoughtful curation has led to some of our most engaging discussions."
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Fantasy Novel Enthusiast",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 5,
    comment: "The fantasy section is comprehensive and well-organized. I love how they showcase both popular series and hidden gems. The personalized recommendations have introduced me to amazing new authors!"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Parent & Teacher",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 5,
    comment: "The children's book section is exceptional! The age-appropriate categorization and detailed descriptions help me find perfect books for both my students and my kids."
  },
  {
    id: 6,
    name: "Robert Martinez",
    role: "Personal Development Coach",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 5,
    comment: "The self-help collection is outstanding. I appreciate how they highlight both classic works and contemporary insights. The reading progress tracker is a game-changer!"
  },
  {
    id: 7,
    name: "Sophia Lee",
    role: "Digital Nomad",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 5,
    comment: "The e-book experience is seamless across all my devices. I love how I can switch between reading and audiobooks. Perfect for my traveling lifestyle!"
  },
  {
    id: 8,
    name: "David Kumar",
    role: "Historical Fiction Lover",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    rating: 5,
    comment: "Their historical fiction section is a treasure trove. The detailed time period filters and historical context notes make finding the perfect book so easy."
  },
  {
    id: 9,
    name: "Emma Watson",
    role: "Mystery Novel Enthusiast",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    rating: 5,
    comment: "The mystery and thriller section is addictive! The 'If you like this, you'll love...' feature has helped me discover so many great new series."
  }
];

const ReviewSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reviewsPerView = 3;
  const totalSlides = Math.ceil(reviewData.length / reviewsPerView);
  
  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isTransitioning, activeIndex]);
  
  const goToNextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const nextIndex = (activeIndex + 1) % totalSlides;
    setActiveIndex(nextIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToPrevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const prevIndex = activeIndex === 0 ? totalSlides - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  const goToSlide = (index) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-5 h-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  // Get visible reviews for current slide
  const getVisibleReviews = () => {
    const startIdx = activeIndex * reviewsPerView;
    const visibleReviews = [];
    
    for (let i = 0; i < reviewsPerView; i++) {
      const reviewIdx = (startIdx + i) % reviewData.length;
      visibleReviews.push(reviewData[reviewIdx]);
    }
    
    return visibleReviews;
  };

  return (
    <div className="bg-slate-950 py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Readers Say</h2>
          <p className="text-gray-300">Discover what our community thinks about their reading experience.</p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-all duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className="w-full flex-shrink-0 flex flex-wrap"
                >
                  {reviewData
                    .slice(slideIndex * reviewsPerView, Math.min((slideIndex + 1) * reviewsPerView, reviewData.length))
                    .concat(
                      // Fill with items from the beginning if we don't have enough
                      slideIndex === totalSlides - 1 && reviewData.length % reviewsPerView !== 0
                        ? reviewData.slice(0, reviewsPerView - (reviewData.length % reviewsPerView))
                        : []
                    )
                    .map((review) => (
                      <div key={review.id} className="w-full md:w-1/3 px-4 mb-8">
                        <div className="bg-slate-900 rounded-xl shadow-xl p-8 h-full flex flex-col border border-slate-800 hover:border-secondary transition-colors duration-300">
                          <div className="flex items-center mb-6">
                            <img 
                              src={review.image} 
                              alt={review.name} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-secondary"
                            />
                            <div className="ml-4">
                              <h3 className="text-xl font-semibold text-white">{review.name}</h3>
                              <p className="text-gray-300">{review.role}</p>
                            </div>
                            <div className="ml-auto">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative flex-grow">
                            <span className="absolute -top-3 -left-2 text-5xl text-secondary opacity-20">"</span>
                            <p className="text-gray-300 text-base leading-relaxed relative z-10 mb-6">{review.comment}</p>
                            <span className="absolute -bottom-6 -right-2 text-5xl text-secondary opacity-20">"</span>
                          </div>
                          
                          <div className="flex items-center mt-6 pt-4 border-t border-slate-800">
                            <span className="text-gray-400 text-sm">Verified Reader</span>
                            <span className="ml-auto text-secondary font-medium">
                              {review.rating}.0 Rating
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 bg-slate-900/90 backdrop-blur-sm text-white rounded-full p-3 shadow-lg hover:bg-slate-800 transition-all duration-300 hover:scale-110 z-10 border border-slate-800"
            onClick={goToPrevSlide}
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 bg-slate-900/90 backdrop-blur-sm text-white rounded-full p-3 shadow-lg hover:bg-slate-800 transition-all duration-300 hover:scale-110 z-10 border border-slate-800"
            onClick={goToNextSlide}
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-secondary'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSlider;
