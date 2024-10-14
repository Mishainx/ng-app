import HomeIcon from "@/icons/HomeIcon"
import DesktopMenu from "../desktopmenu/desktopMenu";
import MobileMenu from "../mobilemenu/mobileMenu";
import ProductsIcon from "@/icons/ProductsIcon";
import CartIcon from "@/icons/CartIcon";

const pages=[
  {title:"Catalogo", href:"/catalogo",src:<ProductsIcon width="20" height="20" />},
  {title:"Mi pedido", href:"/order",src:<CartIcon width="20" height="20"/>},
]


export default function NavBar() {
  return (
    <nav>
      <DesktopMenu pages={pages}/>
      <MobileMenu pages={pages}/>
    </nav>
  );
}

