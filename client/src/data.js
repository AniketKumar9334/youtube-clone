import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

export const sideBarData = [
    {
        id: 1,
        path: '/my-channel',
        title: 'Your Channel',
        icon: <AccountBoxOutlinedIcon/>,
    },
    {
        id: 2,
        title: 'History',
        path: '/feed/history',
        icon: <HistoryOutlinedIcon/>,
    },
    {
        id: 3,
        title: 'Your Videos',
        path: '/feed/dashboard',
        icon: <OndemandVideoIcon/>,
    },
    {
        id: 4,
        title: 'Watch later',
        path: '/feed/watchlater',
        icon: <WatchLaterOutlinedIcon/>,
    },{
        id: 5,
        title: 'Liked videos',
        path: '/feed/like',
        icon: <ThumbUpOffAltIcon/>,
    }
]