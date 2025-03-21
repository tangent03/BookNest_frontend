import React, { useState } from 'react';
import Card from './Card';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Testimonials = (props) => {
  let reviews = props.reviews;
  const [index, setIndex] = useState(0);

  function leftShiftHandler() {
    setIndex((index - 1 + reviews.length) % reviews.length);
  }

  function rightShiftHandler() {
    setIndex((index + 1) % reviews.length);
  }

  function surpriseHandler() {
    let randomIndex = Math.floor(Math.random() * reviews.length);
    setIndex(randomIndex);
  }

  return (
    <div className='w-full max-w-[90vw] md:max-w-[700px] bg-white flex flex-col justify-center items-center mt-10 p-8 md:p-12 transition-transform duration-500 hover:shadow-xl rounded-lg shadow-md'>
      <Card review={reviews[index]} />
      <div className='flex text-4xl mt-10 gap-8 text-violet-400 font-bold'>
        <button onClick={leftShiftHandler} className='hover:text-violet-500 transition duration-200'>
          <FiChevronLeft />
        </button>
        <button onClick={rightShiftHandler} className='hover:text-violet-500 transition duration-200'>
          <FiChevronRight />
        </button>
      </div>
      {/* <div className='mt-8'>
        <button onClick={surpriseHandler} className='bg-violet-500 hover:bg-violet-600 transition duration-300 px-8 py-3 rounded-lg font-semibold text-white text-lg shadow-md'>
          Surprise Me!
        </button>
      </div> */}
    </div>
  );
}

export default Testimonials;
