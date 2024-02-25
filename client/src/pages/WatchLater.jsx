import React from "react";
import IMG from "../assites/background.jpg";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { Link } from "react-router-dom";
import VideoListSmallView from "../components/VideoListSmallView";
const WatchLater = () => {
    return (
        <div className="flex gap-1 h-[85vh] overflow-hidden max-lg:flex-col max-lg:gap-3 ">
            <div className=" max-lg:h-fit flex flex-col h-full rounded-xl gap-3 p-6 bg-gradient-to-r from-stone-500 to-stone-700 ">
                <div className="flex flex-col max-md:flex-col max-md:items-start max-lg:flex-row max-lg:gap-3 max-lg:items-center gap-2">
                    <div className="w-72 rounded-lg max-lg:w-96 max-lg:h-48">
                        <img className="rounded-lg" src={IMG} alt="" />
                    </div>
                    <div className="flex flex-col ">
                        <p className="text-white text-2xl font-bold mb-3">
                            Watch later
                        </p>
                        <div className="flex flex-col max-md:flex-row max-md:gap-6 max-md:items-center">
                            <div className="mb-4">
                                <p className="text-white text-sm">
                                    Coder Aniket
                                </p>
                                <p className="text-white text-sm">15 views</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="rounded-full p-2 bg-gray-400 text-white">
                                    <VerticalAlignBottomIcon />
                                </span>
                                <span className="rounded-full p-2 bg-gray-400 text-white">
                                    <MoreVertIcon />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full gap-2 ">
                    <Link className="px-5 w-full justify-center rounded-2xl py-1 flex gap-1 items-center bg-white text-black">
                        <PlayArrowIcon />
                        <p>play all</p>
                    </Link>
                    <Link className="px-5 w-full justify-center rounded-2xl py-1 flex gap-1 items-center bg-white text-black">
                        <ShuffleIcon />
                        <p>Shuffle</p>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col flex-1 overflow-y-scroll snap-x scroll-mx-2 ">
                <VideoListSmallView />
                <VideoListSmallView />
                <VideoListSmallView />
                <VideoListSmallView />
                <VideoListSmallView />
                <VideoListSmallView />
                <VideoListSmallView />
                <VideoListSmallView />
            </div>
        </div>
    );
};

export default WatchLater;
