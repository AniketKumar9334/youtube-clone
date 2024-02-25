import { Link } from "react-router-dom";
import IMG from "../assites/background.jpg";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const PlaylistItem = ({isShow = true}) => {
    return (
        <Link to={'/playlist/oijk'}className="flex flex-col gap-2 ">
            <div className="rounded-xs relative">
                <img src={IMG} alt="" className="rounded-xl " />
                <span className="absolute px-1 py-0.5 rounded-md text-xs bg-black text-white bottom-1 right-2">
                    <div className="flex items-center">
                        <PlaylistAddCheckIcon style={{fontSize: 16}}/>
                        <span className="text-color font-normal text-xs">
                            14 videos
                        </span>
                    </div>
                </span>
            </div>

            <div className="flex flex-col px-1 gap-1">
                    <p className="text-sm font-medium">
                        Python prigrammin for biggner Python prigrammin
                    </p>
                    <div className="flex flex-col">
                         {isShow && (<div className="flex items-center gap-1">
                        <Link to={'/channel/iojj'} className="text-gray-500 text-xs hover:text-gray-800">chai or code</Link>
                        <div className="rounded-full w-1 h-1 bg-gray-500"></div>
                        <Link to={'/channel/iojj'} className="text-gray-500 text-xs hover:text-gray-800">Playlist</Link>
                        </div>)}

                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs">
                                View full playlist
                            </span>
                        </div>
                    </div>
                </div>
        </Link>
    );
};

export default PlaylistItem;
