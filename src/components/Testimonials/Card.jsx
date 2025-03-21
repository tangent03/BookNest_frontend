import React from 'react';
import { FaQuoteLeft, FaQuoteRight, FaGithub } from 'react-icons/fa';

const Card = (props) => {
  let review = props.review;
  return (
    <div className='flex flex-col items-center relative text-center'>
      {/* Adjusted the top margin to increase the gap */}
      <div className='absolute top-[-5rem] z-10'>
        <img className='aspect-square rounded-full w-[140px] h-[140px] border-4 border-white shadow-lg' src={review.image} />
        <div className='w-[140px] h-[140px] bg-violet-500 rounded-full absolute top-[-6px] z-[-1] left-[10px]'></div>
      </div>
      {/* Increased margin-top for more spacing between the title and the image */}
      <div className='mt-28'>
        <p className='text-3xl font-semibold capitalize tracking-wide text-gray-800'>{review.name}</p>
        <p className='text-violet-400 uppercase text-sm mt-1'>{review.job}</p>
      </div>
      <div className='text-violet-500 mt-4'>
        <FaQuoteLeft size={24} />
      </div>
      <p className='text-gray-600 mt-3 px-6 md:px-10 leading-relaxed'>{review.text}</p>
      <div className='text-violet-500 mt-4'>
        <FaQuoteRight size={24} />
      </div>
      
      {/* Added GitHub button */}
      <div className='mt-6'>
        <a href={review.github} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-200'>
          <FaGithub size={20} />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  );
}

export default Card;
