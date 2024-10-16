"use client"
import MenuIcon from "@/icons/MenuIcon";
import MenuList from "../menulist/menuList";
import { useState } from "react";

export default function MobileMenu({ pages }) {
    const [open, setOpen] = useState(false);

    const handleMenu = () => setOpen(!open);
    const handleClose = () => setOpen(false);

    return (
        <>  
            <div onClick={handleMenu} className="lg:hidden">
                <MenuIcon width={25} height={25}/>
            </div>

            <MenuList open={open} handleClose={handleClose} pages={pages} />
        </>
    );
}
