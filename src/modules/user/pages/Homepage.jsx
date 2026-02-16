import React, { Suspense, lazy } from "react";
import NavbarSub from "../../../shared/components/NavbarSub";

// Lazy imports
const Navbar = lazy(() => import("../../../shared/components/Navbar"));
const Home = lazy(() => import("./Home"));

function Homepage() {
    return (
        <div>
            <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                <div className="sticky top-0 z-50">
                    <Navbar color={"white"} />
                </div>
                <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
                    <NavbarSub />
                </div>
                <Home />
            </Suspense>
        </div>
    );
}

export default Homepage;
