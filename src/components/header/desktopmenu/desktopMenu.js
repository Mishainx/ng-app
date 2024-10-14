import Link from "next/link";
import LoginButton from "../loginButton";
import Order from "@/components/order/Order";

export default function DesktopMenu({ pages }) {
  return (
    <ul className="hidden lg:flex space-x-4">
      {pages.map((page, index) => (
        <li
          key={index}
          className="relative flex items-center justify-center gap-3 cursor-pointer py-2 text-xs text-black hover:text-red-500 group"
        >
          <Link href={page.href} className="relative z-10 flex items-center justify-center gap-2">
            {page.src}
            {page.title}
          </Link>
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500 transition-transform duration-500 ease-in-out transform scale-x-0 group-hover:scale-x-100" />
        </li>
      ))}
      <LoginButton />
    </ul>
  );
}
