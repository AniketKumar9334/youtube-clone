import React, { useState } from "react";
import IMG from "../assites/channels4_profile.jpg";
import { Link, NavLink } from "react-router-dom";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';



const UserProfile = () => {
    const [currentUser, setCurrentUser] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(true)

    
    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full gap-8 px-3 ">
                <div className="flex gap-5 items-center max-sm:flex-col ">
                    <div className="w-40 h-40 rounded-full">
                        <img src={IMG} alt="" className="rounded-full" />
                    </div>
                    <div className="flex flex-col gap-2 max-sm:gap-0">
                        <h3 className="text-4xl font-bold max-sm:text-center">Coder Aniket</h3>
                        <div className="flex items-center gap-2 max-sm:justify-center">
                            <Link
                                to={"/channel/fsdjj"}
                                className="text-gray-500"
                            >
                                @coderaniket7454
                            </Link>
                            <div className="rounded-full w-1 h-1 bg-gray-500"></div>
                            <Link
                                to={"/channel/4521dff"}
                                className="text-gray-500 hover:text-gray-600"
                            >
                                View channel
                            </Link>
                        </div>
                        <div className="text-gray-500 pl-1 max-sm:text-center">
                            I am Aniket Kumar i am a programmer I learn
                        </div>
                        <div className="flex gap-2 cursor-pointer mt-2 max-sm:justify-center">
                            <div className={`rounded-3xl px-4 py-1 items-center justify-center flex gap-2 ${isSubscribed ? 'bg-gray-100' : 'bg-black'}`}>
                                {currentUser ? (
                                    <span className=" font-medium">
                                        Customize channel
                                    </span>
                                ) : (
                                    
                                        isSubscribed ? (
                                            <div className="flex gap-2 items-center">
                                        <NotificationsActiveIcon/>
                                        <span className="font-medium">
                                            Subscribed
                                        </span>
                                    </div>
                                        ) :(
                                            <p className="text-white" >Subsribe</p>
                                        )
                                    
                                )}
                            </div>
                            <div className="bg-gray-100 px-4 py-2 rounded-full justify-center items-center flex gap-2 ">
                                <span className="font-medium">
                                    {
                                        currentUser ? 'Manage videos' : "Join"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <ul className="flex gap-7 cursor-pointer">
                        <NavLink
                            to={"/channel/username/home"}
                            className={ ({isActive}) => (isActive ? 'text-black underline underline-offset-[15px] font-bold' : 'text-gray-600 font-bold hover:underline underline-offset-[15px]')}                        >
                            Home
                        </NavLink>
                        <NavLink to={"/channel/username/videos"} className={ ({isActive}) => (isActive ? 'text-black underline underline-offset-[15px] font-bold' : 'text-gray-600 font-bold hover:underline underline-offset-[15px]')} >Videos</NavLink>
                        <NavLink to={"/channel/username/shorts"}  className={ ({isActive}) => (isActive ? 'text-black underline underline-offset-[15px] font-bold' : 'text-gray-600 font-bold hover:underline underline-offset-[15px]')}>Shorts</NavLink>
                        <NavLink to={"/channel/username/live"}  className={ ({isActive}) => (isActive ? 'text-black underline underline-offset-[15px] font-bold' : 'text-gray-600 font-bold hover:underline underline-offset-[15px]')}>Live</NavLink>
                        <NavLink to={"/channel/username/playlists"}  className={ ({isActive}) => (isActive ? 'text-black underline underline-offset-[15px] font-bold' : 'text-gray-600 font-bold hover:underline underline-offset-[15px]')} >
                            Playlists
                        </NavLink>
                        <NavLink to={"/channel/username/community"}  className={ ({isActive}) => (isActive ? 'text-black underline underline-offset-[15px] font-bold' : 'text-gray-600 font-bold hover:underline underline-offset-[15px]')}>
                            Community
                        </NavLink>
                    </ul>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
            </div>
        </div>
    );
};

export default UserProfile;
