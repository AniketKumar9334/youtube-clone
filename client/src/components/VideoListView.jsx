import React from "react";
import { Link } from "react-router-dom";
import IMG from "../assites/background.jpg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

const VideoListView = () => {
    return (
        <Link to={"/video/detail/videoid"} className="flex gap-3 ">
            <div className="rounded-sm relative grow-0">
                <div className="w-64 relative">
                    <img src={IMG} alt="" className="rounded-xl " />
                    <span className="absolute px-1 py-0.5 rounded-md text-xs bg-black text-white bottom-1 right-2">
                        14:30
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-3 py-2">
                <div className="">
                    <div className="flex gap-4">
                        <p className="text-lg font-medium">
                            Python prigrammin for biggner Python prigrammin this
                            is the video in this world
                        </p>
                        <CloseIcon />
                        <MoreVertIcon />
                    </div>
                    <div className="flex gap-2 items-center">
                        <p className="text-sm text-gray-500">Comedy reels</p>
                        <p className="text-sm bg-gray-500 w-1 h-1 rounded-full"></p>
                        <p className="text-sm text-gray-500">7.4M views</p>
                    </div>
                </div>
                <div className="text-gray-500 text-sm">
                    I am Aniket Kumar i am a programmer I learn
                </div>
            </div>
        </Link>
    );
};

export default VideoListView;
