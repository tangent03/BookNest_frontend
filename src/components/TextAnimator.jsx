import React from 'react'
import {useTypewriter , Cursor} from 'react-simple-typewriter'

const TextAnimator = () => {
    const [text] = useTypewriter({
        words: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
        loop:{},
        typeSpeed: 100,
        deleteSpeed: 80,
    });
  return (
    <div>
            <div className='m-24 text-green-400'>
                I'm a {' '}
                <span className='text-red-500'>
                    {text}
                </span>
                
                <span className='text-red-500'>
                    <Cursor cursorStyle='|'/>
                </span>
            </div>
    </div>
  )
}

export default TextAnimator
