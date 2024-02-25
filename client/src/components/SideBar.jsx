import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { NavLink } from "react-router-dom";
import SideBarItem from "./SideBarItem";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const SideBar = () => {
    const id = "jfosjfi";
    return (
        <div className="flex flex-col w-full mt-16 max-md:w-fit max-md:items-center max-md:justify-center">
            <div className="flex flex-col w-full">
                <div className="sideBar w-full hover:overflow-y-scroll">
                    <div className="flex w-[98%] flex-col mt-3 max-md:w-fit max-md:gap-3">
                        <SideBarItem
                            to={"/"}
                            icon={<HomeIcon />}
                            title={"Home"}
                        />
                        <SideBarItem
                            to={"/feed/shorts"}
                            icon={<VideoLibraryIcon />}
                            title={"Shorts"}
                        />
                        <SideBarItem
                            to={"/feed/subscriptions"}
                            icon={<SubscriptionsOutlinedIcon />}
                            title={"Subscriptions"}
                        />
                    </div>
                    <div className=" w-[98%] h-[1px] my-4 bg-gray-200"></div>
                    <div className="flex w-[98%] flex-col mt-3 max-md:w-fit max-md:gap-3">
                        <NavLink
                            to={"/feed/you"}
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-5 p-2 px-3 rounded-lg bg-gray-200"
                                    : "flex items-center gap-5 p-2 px-3 rounded-lg max-md:gap-0 hover:bg-gray-200"
                            }
                        >
                            <p className="font-bold">You</p>
                            <span className="max-md:hidden">
                                <KeyboardArrowRightIcon />
                            </span>
                        </NavLink>
                        <SideBarItem
                            to={`/channel/${id}`}
                            icon={<AccountBoxOutlinedIcon />}
                            title={"Your channel"}
                        />
                        <SideBarItem
                            to={"/feed/history"}
                            icon={<HistoryOutlinedIcon />}
                            title={"History"}
                        />
                        <SideBarItem
                            to={"/feed/dashboard"}
                            icon={<OndemandVideoIcon />}
                            title={"Your videos"}
                        />
                        <SideBarItem
                            to={"/feed/watchlater"}
                            icon={<WatchLaterOutlinedIcon />}
                            title={"Watch later"}
                        />
                        <SideBarItem
                            to={"/feed/like"}
                            icon={<ThumbUpOffAltIcon />}
                            title={"Liked videos"}
                        />
                    </div>
                    <SideBarItem
                        to={"/jijalf"}
                        icon={<KeyboardArrowDownOutlinedIcon />}
                        title={"Show more"}
                    />
                </div>
            </div>
        </div>
    );
};

export default SideBar;
