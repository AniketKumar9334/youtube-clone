import React from 'react'
import UserProfile from '../../components/UserProfile'
import VideoItem from '../../components/VideoItem'

const UserVideos = () => {
  return (
    <div className='flex flex-col gap-8'>
      <UserProfile/>
      <div className="grid grid-cols-4 gap-3 gap-y-6 max-lg:grid-cols-3 max-sm:grid-cols-1">    
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
          <VideoItem isSmallScreen={true}/>
      </div>
    </div>
  )
}

export default UserVideos