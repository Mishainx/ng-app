import Image from "next/image";

// Componente de Data Fiscal
const ArcaButton = () => {
    return (
      <div className="w-full  lg:w-1/4 flex flex-col items-center justify-center">
        <Image
          src="/data/data-fiscal-final.png" // Cambiar cuando se proporcione el QR real
          alt="Data Fiscal QR"
          width={100}
          height={100}
          className="mb-2"
        />
      </div>
    );
  };

  
export default ArcaButton;