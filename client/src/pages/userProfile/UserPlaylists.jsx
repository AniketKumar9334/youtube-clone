import React from 'react'
import UserProfile from '../../components/UserProfile'
import PlaylistItem from '../../components/PlaylistItem'

const UserPlaylists = () => {
  return (
    <div className='flex flex-col gap-5 pb-4'>
      <UserProfile/>
      <p>Created playlists</p>
      <div className="grid grid-cols-6 gap-1 gap-y-5 max-lg:grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        <PlaylistItem isShow={false}/>
        
        </div>
    </div>
  )
}

export default UserPlaylists