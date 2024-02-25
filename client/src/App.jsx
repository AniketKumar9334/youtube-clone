import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import Home from "./pages/Home";
import SubscribedVideos from "./pages/SubscribedVideos";
import YourChannel from "./pages/YourChannel";
import SearchVideos from "./pages/SearchVideo";
import ChannelDetails from "./pages/ChannelDetails";
import LikedVideos from "./pages/LikedVideos";
import VideoDetails from "./pages/VideoDetails";
import History from "./pages/History";
import PlaylistDetails from "./pages/PlaylistDetails";
import You from "./pages/You";
import Playlist from "./pages/Playlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserHome from "./pages/userProfile/UserHome";
import UserVideos from "./pages/userProfile/UserVideos";
import UserShorts from "./pages/userProfile/UserShorts";
import Live from "./pages/userProfile/Live";
import Community from "./pages/userProfile/Community";
import UserPlaylists from "./pages/userProfile/UserPlaylists";
import WatchLater from "./pages/WatchLater";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainContainer />}>
                    <Route index element={<Home />} />
                    <Route
                        path="feed/subscriptions"
                        element={<SubscribedVideos />}
                    />
                    <Route path="channel/:id" element={<YourChannel />} />
                    <Route path="feed/history" element={<History />} />
                    <Route path="feed/like" element={<LikedVideos />} />
                    <Route path="search/:query" element={<SearchVideos />} />
                    <Route
                        path="channel/:username"
                        element={<ChannelDetails />}
                    />
                    <Route path="channel/:username/home" element={<UserHome />} />
                    <Route path="channel/:username/videos" element={<UserVideos />} />
                    <Route path="channel/:username/shorts" element={<UserShorts />} />
                    <Route path="channel/:username/live" element={<Live />} />
                    <Route path="channel/:username/playlists" element={<UserPlaylists />} />
                    <Route path="channel/:username/community" element={<Community />} />

                    <Route
                        path="video/detail/:videoid"
                        element={<VideoDetails />}
                    />
                    <Route path="playlists" element={<Playlist />} />
                    <Route path="feed/watchlater" element={<WatchLater />} />
                    <Route
                        path="playlist/:playlistId"
                        element={<PlaylistDetails />}
                    />
                    <Route path="feed/you" element={<You />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
