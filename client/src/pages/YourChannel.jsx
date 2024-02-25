import React from 'react'
import UserProfile from '../components/UserProfile'
import { Outlet } from 'react-router-dom'

const YourChannel = () => {
  return (
    <div className="flex flex-col gap-4">
      <UserProfile/>
    </div>
  )
}

export default YourChannel