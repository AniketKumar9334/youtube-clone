import React from "react";
import { Link } from "react-router-dom";

const SideBarItem = ({icon, to,title}) => {
    return (
        <Link
            to={to}
            className={`flex items-center gap-5 p-2 px-3 rounded-lg hover:bg-gray-200`}
        >
            <span>
                {icon}
            </span>
            <span>{title}</span>
        </Link>
    );
};

export default SideBarItem;
