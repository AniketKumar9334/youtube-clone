import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import USERIMG from "../assites/user.png";
import MenuIcon from "@mui/icons-material/Menu";
import LOGO from "../assites/youtube-logo.png";
const TopComponent = () => {
    return (
        <div className="flex w-full h-16 top-0 left-0 right-0 px-7 bg-white fixed z-50 max-sm:p-3">
            <div className="flex items-center gap-2">
                <MenuIcon />
                <div className="w-28 max-sm:hidden">
                    <img src={LOGO} alt="" />
                </div>
            </div>
            <div className="flex flex-1 w-full items-center">
                <div className="flex  justify-center w-full gap-3 ">
                    <div className="flex items-center w-[54%] max-sm:w-[70%]">
                        <input
                            className=" max-sm:py-1 py-2 w-full px-5 my-border rounded-l-3xl"
                            type="text"
                            placeholder="Search..."
                        />
                        <span className="py-2 px-5 max-sm:p-1 my-border rounded-r-3xl">
                            <SearchIcon />
                        </span>
                    </div>
                    <span className="max-sm:hidden bg-gray-100 rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer">
                        <KeyboardVoiceIcon />
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4 ">
                <span className="hover:rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer max-sm:hidden">
                    <VideoCallIcon />
                </span>
                <span className="hover:rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer max-sm:hidden">
                    <NotificationsNoneIcon />
                </span>
                <div className="w-8 h-8 rounded-full">
                    <img src={USERIMG} alt="" />
                </div>
            </div>
        </div>
    );
};

export default TopComponent;
