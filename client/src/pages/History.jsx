import VideoListView from "../components/VideoListView";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

const History = () => {
    return (
        <div className="flex flex-col gap-5">
            <p className="font-bold text-4xl">Watch history</p>
            <div className="grid grid-cols-3 gap-10 ">
                <div className="col-span-2 flex flex-col gap-3 ">
                    <VideoListView />
                    <VideoListView />
                    <VideoListView />
                    <VideoListView />
                    <VideoListView />
                    <VideoListView />
                    <VideoListView />
                    <VideoListView />
                    <VideoListView />
                </div>
                <div className="flex flex-col gap-5 py-3 w-2/3 fixed top-[20%] right-[-40%]">
                    <div className="flex  border-b border-solid pb-1 border-black gap-1 w-fit">
                        <SearchIcon />
                        <input type="text" placeholder="Search watch history" />
                    </div>
                    <p className="py-2 px-3 w-fit cursor-pointer hover:bg-gray-100 rounded-2xl">
                        <DeleteOutlineIcon /> Clear all watch history
                    </p>
                    <p className="py-2 px-3 w-fit cursor-pointer hover:bg-gray-100 rounded-2xl">
                        <PauseCircleOutlineIcon /> Pause watch history
                    </p>
                    <p className="py-2 px-3 w-fit cursor-pointer hover:bg-gray-100 rounded-2xl">
                        <SettingsSuggestIcon /> Manage all history
                    </p>
                </div>
            </div>
        </div>
    );
};

export default History;
