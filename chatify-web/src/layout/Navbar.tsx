import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from "motion/react"

const Navbar = () => {
  return (
    <div>
            <div className="fixed top-0 -z-10 h-full w-full">
            <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div></div>
            </div>
            <div className='fixed top-0 '>
            <motion.div className='flex w-full p-8  '>
            <span className='bg-gradient-to-r from-green-200 bg-green-500 to-green-700  bg-clip-text text-transparent text-4xl font-bold tracking-tight  '>CHATIFY</span>
          </motion.div>
            </div>
          
      <Outlet />
    </div>
  )
}

export default Navbar
