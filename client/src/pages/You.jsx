import React, { useState } from "react";
import IMG from "../assites/channels4_profile.jpg";
import GoogleIcon from "@mui/icons-material/Google";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { Link } from "react-router-dom";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import VideoItem from "../components/VideoItem";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistItem from "../components/PlaylistItem";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';


const You = () => {
    const [isShowMoreShow, setIsShowMoreShow] = useState(true);
    return (
        <div className="flex flex-col gap-5 px-1 pb-5">
            <div className="flex gap-4 items-center">
                <div className="w-28 h-28 rounded-full">
                    <img src={IMG} alt="" className="rounded-full" />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-4xl font-bold">Coder Aniket</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                            @coderaniket7454
                        </span>
                        <div className="rounded-full w-1 h-1 bg-gray-500"></div>
                        <Link
                            to={"/channel/4521dff"}
                            className="text-gray-500 text-xs hover:text-gray-600"
                        >
                            View channel
                        </Link>
                    </div>
                    <div className="flex gap-[4px] cursor-pointer mt-2">
                        <div className="rounded-3xl px-3 py-2 items-center justify-center bg-gray-100 flex gap-2 ">
                            <SwitchAccountIcon style={{ fontSize: 16 }} />
                            <span className="text-[11px] font-medium">
                                Switch Account
                            </span>
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-full justify-center items-center flex gap-2 ">
                            <GoogleIcon style={{ fontSize: 16 }} />
                            <span className="text-[11px] font-medium">
                                Google Account
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <HistoryOutlinedIcon />
                        <p className="font-semibold text-xl">History</p>
                    </div>
                    <Link
                        to={"/feed/history"}
                        className="text-blue-600 cursor-pointer text-sm"
                    >
                        See all
                    </Link>
                </div>
                <div className="grid grid-cols-6 gap-1 gap-y-5 max-lg:grid-cols-4 max-sm:grid-cols-2">
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300"></div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <WatchLaterOutlinedIcon />
                        <p className="font-semibold text-xl">
                            Watch later{" "}
                            <span className="text-gray-500 ml-2 text-lg">
                                15
                            </span>
                        </p>
                    </div>
                    <Link
                        to={"/feed/watchlater"}
                        className="text-blue-600 cursor-pointer text-sm"
                    >
                        See all
                    </Link>
                </div>
                <div className="grid grid-cols-6 gap-1 max-lg:grid-cols-4 max-sm:grid-cols-2">
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300"></div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <PlaylistAddCheckIcon />
                        <p className="font-semibold text-xl">Playlists </p>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-6 gap-1 max-lg:grid-cols-4 max-sm:grid-cols-2">
                        <PlaylistItem />
                        <PlaylistItem />
                        <PlaylistItem />
                        <PlaylistItem />
                        <PlaylistItem />
                        <PlaylistItem />
                        <PlaylistItem />
                        <PlaylistItem />
                    </div>
                    {isShowMoreShow && (
                        <p
                            className="px-2 cursor-pointer"
                            onClick={() => setIsShowMoreShow(false)}
                        >
                            show more
                        </p>
                    )}
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300"></div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <ThumbUpOffAltIcon />
                        <p className="font-semibold text-xl">
                            Liked videos{" "}
                            <span className="text-gray-500 ml-2 text-lg">
                                15
                            </span>
                        </p>
                    </div>
                    <Link
                        to={"/feed/like"}
                        className="text-blue-600 cursor-pointer text-sm"
                    >
                        See all
                    </Link>
                </div>
                <div className="grid grid-cols-6 gap-1 max-lg:grid-cols-4 max-sm:grid-cols-2">
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                    <VideoItem isSmallScreen={true} />
                </div>
            </div>
        </div>
    );
};

export default You;
