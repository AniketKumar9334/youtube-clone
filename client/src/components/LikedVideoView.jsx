import React, { useState } from "react";
import IMG from "../assites/background.jpg";
import MoreVertIcon from '@mui/icons-material/MoreVert';
const LikedVideoView = ({open = false, count= 1}) => {
    const [isOpen, setIsOpen] = useState(open)
    return (
        <div onClick={() =>setIsOpen(isOpen ? false : true)} className="w-full hover:bg-gray-100 py-2 rounded-lg px-3 flex gap-2 relative cursor-pointer">
            <p className="absolute top-8 left-2">{count}</p>
            <div className="rounded-sm relative grow-0 ml-3">
                <div className="w-44 h-24 relative">
                    <img src={IMG} alt="" className="rounded-xl " />
                    <span className="absolute px-1 py-0.5 rounded-md text-xs bg-black text-white bottom-1 right-2">
                        14:30
                    </span>
                </div>
            </div>
            <div className="flex flex-col pt-2 pr-10 max-md:pr-3">
                <p className="font-bold text-lg max-sm:text-xs">Android Video Calling app like whats appp and IO tutorial in hindi</p>
                <div className="flex items-center gap-1 max-md:flex-col max-md:items-start max-md:gap-0">
                    <p className="text-xs text-gray-400">Mian Speaks</p>
                    <div className="w-1 h-1 bg-gray-200 rounded-full max-md:hidden"></div>
                    <p className="text-xs text-gray-400">134k views</p>
                    <div className="w-1 h-1 bg-gray-200 rounded-full max-md:hidden"></div>
                    <p className="text-xs text-gray-400">3 years ago</p>
                </div>
            </div>
            <div className="absolute top-4 right-5 max-md:right-0">
                <MoreVertIcon onClick={()=> setIsOpen(!isOpen)}/>
            </div>
            <div className={`absolute py-4 bg-white rounded-md shadow-2xl top-10 right-8 z-30 ${!isOpen ? "invisible" : ''}`}>
                <ul className="flex flex-col ">
                    <li className="hover:bg-gray-100 py-3 px-5" >Add video to watch later</li>
                    <li className="hover:bg-gray-100 py-3 px-5" >Remove from liked videos</li>
                    <li className="hover:bg-gray-100 py-3 px-5">Download</li>
                    <li className="hover:bg-gray-100 py-3 px-5">Share</li>
                </ul>
            </div>
        </div>
    );
};

export default LikedVideoView;
