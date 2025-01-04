import React from 'react'
import { motion } from "motion/react"
import { div } from 'motion/react-client';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserData } from '../redux/authSlice';


const SideBar = () => {
    const dummyContacts = ["Person1", "Person2", "Person3"];
    const dispatch=useDispatch()

  return (
    <div className='w-1/5 min-h-screen '>
   
  {/* right hand side----------------------------------- */}
  <div className=" relative w-full h-full flex flex-col bg-gray-800 text-white ">
    <motion.div className="flex w-full p-8  ">
      <span className="bg-gradient-to-r from-green-200 bg-green-500 to-green-700  bg-clip-text text-transparent text-4xl font-bold tracking-tight  ">
        CHATIFY
      </span>
    </motion.div>
    <div className=" relative  flex flex-col w-full p-4 gap-4 cursor-pointer">
          {dummyContacts.map((contact, index) => (
            <div>
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex  justify-items-start gap-2 items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
            >
              
                <img src="https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png" alt="profile-pic" className='w-8 h-8 rounded-full' />
                <div>{contact}</div>
               
                <div className='absolute top-1 right-1 bg-green-300 flex items-center justify-center h-5 w-5 rounded-full'>2</div>
         
            </motion.div>
            
             </div>
          ))}

        </div>
        <div
        className='fixed  bottom-4 left-4  flex  justify-items-start gap-2 items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer '
        onClick={()=>{dispatch(clearUserData())}}
        >
          Sign Out
        </div>
    
  </div>
 
  </div>
  )
}

export default SideBar
