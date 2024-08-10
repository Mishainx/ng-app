import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
            <Link href="/">
                <div className="w-full h-full flex items-center">
                    <div className="relative w-32 h-16">
                        <Image 
                            src="/nippon-game-logo.png" 
                            alt=" Nippon game logo"
                            fill={true}
                            className="p-2"
                        />
                    </div>
                </div>            
            </Link>
    );
}

