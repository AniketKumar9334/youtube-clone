import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import TopComponent from "./TopComponent";

const MainContainer = () => {
    return (
        <section className="flex gap-8 ">
            <div className="w-72 px-4">
                <SideBar />
            </div>
            <div className="w-full pt-2 pr-6 h-dvh overflow-y-scroll">
                <TopComponent/>
                <Outlet />
            </div>
        </section>
    );
};

export default MainContainer;
