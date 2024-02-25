import React from "react";
import VideoItem from "../components/VideoItem";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
const SubscribedVideos = () => {
    return (
        <>
        <div className="flex justify-between py-4 pr-4">
          <p className="font-bold text-xl" >Latest</p>
          <div className="flex gap-3">
            <p>Manage</p>
            <p><ViewModuleIcon/></p>
            <p><ViewListIcon/></p>
          </div>
        </div>
            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
            </div>
        </>
    );
};

export default SubscribedVideos;
