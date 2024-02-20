import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import USERIMG from '../assites/user.png'


const TopComponent = () => {
    return (
        <div className="flex w-full">
            <div className="flex flex-1 items-center">
                <div className="flex  justify-center w-full gap-3">
                    <div className="flex items-center w-[56%]">
                        <input
                            className="py-2 w-full px-5 my-border rounded-l-3xl"
                            type="text"
                            placeholder="Search..."
                        />
                        <span className="py-2 px-5  my-border rounded-r-3xl">
                            <SearchIcon />
                        </span>
                    </div>
                    <span className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer">
                        <KeyboardVoiceIcon />
                    </span>

                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="hover:rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer">
                    <VideoCallIcon />
                </span>
                <span className="hover:rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer">
                    <NotificationsNoneIcon/>
                </span>
                <div className="w-8 h-8 rounded-full">
                    <img src={USERIMG} alt="" />
                </div>

            </div>
        </div>
    );
};

export default TopComponent;
