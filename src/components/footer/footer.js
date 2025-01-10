import FacebookIcon from "@/icons/FacebookIcon";
import InstagramIcon from "@/icons/InstagramIcon";
import MailIcon from "@/icons/MailIcon";
import MapsIcon from "@/icons/MapsIcon";
import WhatsappIcon from "@/icons/WhatsappIcon";
import YoutubeIcon from "@/icons/YoutubeIcon";
import Image from "next/image";
import Link from "next/link";
import ArcaButton from "./ArcaButton";
import RepetanceButton from "./RepetanceButton";

const Footer = () => {
  return (
    <footer className="w-full  bg-black text-gray-400 flex flex-col items-center justify-center">

      <div className="w-full flex items-center justify-around">
        <div className="w-full flex flex-col md:flex-row  items-center justify-around">
          {/* Logo */}
          <div className="w-full lg:w-1/4 flex items-center justify-center">
            <div className="flex flex-col justify-center items-center text-center">
              <Image
                src="/nippon-game-logo.png"
                alt="Nippon game logo"
                width={250}
                height={250}
              />
            </div>
          </div>
          {/* Info */}
          <div className="w-full lg:w-1/4 text-xs flex my-7">
            <ul className="w-full items-center flex flex-col  m-auto leading-relaxed">
              <h3 className="text-slate-50 text-xl font-bold ">Info</h3>
              <li className="flex justify-center items-center gap-3  cursor-pointer hover:text-white transition-colors duration-300">
              <Link href="https://maps.app.goo.gl/cCr4VrpNMuDqTppJA" className="flex justify-center items-center gap-3  cursor-pointer hover:text-white transition-colors duration-300">
                <MapsIcon />
                <p>Av. Corrientes 2416, CABA</p>
              </Link>
              </li>
              <li >
                <Link href="mailto:info@nippongame.com.ar" className="flex justify-center items-center gap-2 cursor-pointer hover:text-white transition-colors duration-300">
                  <MailIcon />
                  <p>info@nippongame.com.ar</p>
                </Link>

              </li>
              <li >
                <Link href="https://wa.me/54911643169750?text=Hola%20Nippon%20Game.%20Quiero%20realizar%20una%20consulta!" className="flex justify-center items-center gap-2 cursor-pointer hover:text-white transition-colors duration-300">
                  <WhatsappIcon />
                  <p>+54 9 11 6431-6975</p>
                </Link>
              </li>
            </ul>
          </div>

        {/* Data fiscal y arrepentimiento*/}
      {/* Red Gradient Div */}
      <div className="flex flex-col text-gray-400 w-full lg:w-1/4  justify-start items-center my-7">
        <ArcaButton/>
        <RepetanceButton/>
      </div>
        </div>
      </div>
    
      {/* RRSS */}
      <div className="p-6 flex justify-center items-center gap-3">
      <Link href="https://maps.app.goo.gl/cCr4VrpNMuDqTppJA">
            <MapsIcon
                        width={50}
                        height={50}
            className="cursor-pointer p-2 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out"
            />
          </Link>
      <Link href="https://www.instagram.com/nippongameoficial/" target="blank">
        <InstagramIcon
            width={50}
            height={50}
            className="cursor-pointer p-1 text-white rounded-full bg-red-500/90 hover:bg-red-800"
          />
      </Link>
        <YoutubeIcon
          width={50}
          height={50}
          className="cursor-pointer p-2 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out"
        />
      </div>
      <div className="w-2/4 border-t border-red-500/90"></div>
      {/* Copyright */}
      <p className="text-sm text-center p-3">© 2024 Nippon Game. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
