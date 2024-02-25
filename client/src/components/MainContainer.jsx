import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import TopComponent from "./TopComponent";

const MainContainer = () => {
    return (
        <section className="flex gap-3 max-md:gap-0 ">
            <div className="w-72 px-4 max-md:w-fit max-md:px-2">
                <SideBar />
            </div>
            <div className="w-full pt-2 pr-6 h-dvh overflow-y-scroll max-md:pl-3">
                <TopComponent/>
                <div style={{marginTop: '5rem'}}>
                <Outlet />
                </div>
            </div>
        </section>
    );
};

export default MainContainer;
