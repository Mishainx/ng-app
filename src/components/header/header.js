import Logo from "../logo/logo";
import NavBar from "./nav.js/navBar";

export default function Header() {
    return (
        <header className="bg-slate-50/95 w-full h-14 sm:h-16 py-2 px-4 flex items-center justify-between shadow-2xl sticky top-0 z-50">
            <Logo />
            <NavBar/>

        </header>
    );
}