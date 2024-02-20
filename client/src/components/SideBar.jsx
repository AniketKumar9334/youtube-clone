import MenuIcon from "@mui/icons-material/Menu";
import LOGO from "../assites/youtube-logo.png";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Link } from "react-router-dom";
import SideBarItem from "./SideBarItem";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const SideBar = () => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-3 w-full px-2">
                    <MenuIcon />
                    <div className="w-28">
                        <img src={LOGO} alt="" />
                    </div>
                </div>
                <div className="sideBar w-full scroll-pl-10 hover:overflow-y-scroll">
                    <div className="flex w-[98%] flex-col mt-3">
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
                    <div className="flex flex-col  w-[98%]">
                        <Link
                            to={"/feed/you"}
                            className="flex items-center gap-1 p-2 px-3 rounded-lg hover:bg-gray-200"
                        >
                            <p className="font-bold">You</p>
                            <span>
                                <KeyboardArrowRightIcon />
                            </span>
                        </Link>
                        <SideBarItem
                            to={"/my-channel"}
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
                        to={"#"}
                        icon={<KeyboardArrowDownOutlinedIcon />}
                        title={"Show more"}
                    />
                </div>
            </div>
        </div>
    );
};

export default SideBar;
