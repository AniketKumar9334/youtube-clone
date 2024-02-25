import React from 'react'
import UserProfile from '../../components/UserProfile'
import CarouselCompoment from '../../components/CarouselCompoment'

const UserHome = () => {
  return (
    <div className='flex flex-col gap-6'>
      <UserProfile/>
      <p className='font-bold text-xl px-1'>For You</p>
      <CarouselCompoment/>
    </div>
  )
}

export default UserHome