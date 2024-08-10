import WhatsappIcon from "@/icons/WhatsappIcon";

export default function CtaProduct({onAddClick}) {
    return (
        <div className="w-full text-xs flex flex-col items-center justify-center gap-2 mb-5 md:flex-row md:gap-5">
            <button 
                className="w-24 bg-slate-700 text-white bg-gradient-to-r from-slate-400 to-slate-700 rounded-md py-1 px-2 hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-800 transition duration-300"
                onClick={() => onAddClick()}
            >
                + Agregar
            </button>
            <button 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-slate-400 to-slate-700 hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-800 text-white px-2 py-1 rounded-md hover:bg-slate-800 transition duration-300"
            >
                <WhatsappIcon width={20} height={20}/> Consultar
            </button>
        </div>
    );
}
