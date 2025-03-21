import React from 'react';
import Banner from '../components/Banner';
import Freebook from '../components/Freebook';
import ReviewSlider from '../components/ReviewSlider';
import Testimonial from '../components/Testimonial';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-950">
            <Banner />
            <Freebook />
            <ReviewSlider />
            <Testimonial />
        </div>
    );
};

export default Home; 