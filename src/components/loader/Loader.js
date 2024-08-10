// components/Loader.js
import Image     from "next/image";

const Loader = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="relative h-28 w-44 flex items-center justify-center">
        <Image 
                            src="/nippon-game-logo.png" 
          alt="logo"
        fill={true}
        className="p-2"
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="h-3 w-3 mr-1 rounded-full bg-[#EA3324] animate-pulse1"></div>
        <div className="h-3 w-3 mr-1 rounded-full bg-[#EA3324] animate-pulse2"></div>
        <div className="h-3 w-3 mr-1 rounded-full bg-[#EA3324] animate-pulse3"></div>
        <div className="h-3 w-3 mr-1 rounded-full bg-[#EA3324] animate-pulse4"></div>
        <div className="h-3 w-3 rounded-full bg-[#EA3324] animate-pulse5"></div>
      </div>
    </div>
  );
};

export default Loader;
