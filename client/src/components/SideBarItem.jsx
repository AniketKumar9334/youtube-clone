import React from "react";
import { Link, NavLink } from "react-router-dom";

const SideBarItem = ({icon, to,title}) => {
    return (
        <NavLink
            to={to}
            className={({isActive}) => (isActive ? 'flex items-center gap-5 p-2 px-3 rounded-lg bg-gray-200' : 'flex items-center gap-5 p-2 px-3 rounded-lg hover:bg-gray-200 max-md:w-fit')}
        >
            <span >
                {icon}
            </span>
            <span className="max-md:hidden">{title}</span>
        </NavLink>
    );
};

export default SideBarItem;
