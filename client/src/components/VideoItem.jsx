import React from "react";
import IMG from "../assites/background.jpg";
import { Link } from "react-router-dom";
const VideoItem = ({ isSmallScreen = false }) => {
    return (
        <Link to={'/video/detail/videoid'} className="flex flex-col gap-2">
            <div className="rounded-sm relative">
                <img src={IMG} alt="" className="rounded-xl " />
                <span className="absolute px-1 py-0.5 rounded-md text-xs bg-black text-white bottom-1 right-2">
                    14:30
                </span>
            </div>
            {isSmallScreen ? (
                <div className="flex flex-col px-1 gap-1 max-sm:gap-0">
                    <p className="text-sm font-medium">
                        Python prigrammin for biggner Python prigrammin
                    </p>
                    <div className="flex flex-col">
                        <Link to={'channel/username'} className="text-gray-500 text-sm hover:text-gray-800 cursor-pointer">chai or code</Link>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs">
                                11k views
                            </span>
                            <div className="rounded-full w-1 h-1 bg-gray-500"></div>
                            <span className="text-gray-500 text-xs">
                                8 hours ago
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-3 ">
                    <div className="w-9 h-9 rounded-full ">
                        <img src={IMG} className="rounded-full" alt="" />
                    </div>
                    <div className="flex-1 ">
                        <p className="font-medium ">
                            Python for javascript devalopers
                        </p>
                        <Link to={'channel/userame'} className="text-gray-500 text-sm hover:text-gray-800 cursor-pointer">chai or code</Link>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">11k views</span>
                            <div className="rounded-full w-1 h-1 bg-gray-500"></div>
                            <span className="text-gray-500">8 hours ago</span>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    );
};

export default VideoItem;
