import React from 'react'
import Banner from '../components/Banner'
import Freebook from '../components/Freebook'
import Navbar from '../components/Navbar'
import ReviewSlider from '../components/ReviewSlider'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <Freebook/>
        <ReviewSlider/>
    </div>
  )
}

export default Home
