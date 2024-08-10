import { useState } from "react";

export default function CounterButton({ onAddClick }) {
    const [count, setCount] = useState(0);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);

    return (
        <div className="w-full text-xs flex flex-col items-center justify-center gap-4 mb-5 md:gap-5">
            <div className="flex gap-4 justify-center items-center">
                <button 
                    className="w-10 bg-slate-700 text-white bg-gradient-to-r from-slate-400 to-slate-700 rounded-md py-1 px-2 hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-800 transition duration-300"
                    onClick={increment}
                >
                    +
                </button>
                <div className="text-white">
                    {count}
                </div>
                <button 
                    className="w-10 bg-slate-700 text-white bg-gradient-to-r from-slate-400 to-slate-700 rounded-md py-1 px-2 hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-800 transition duration-300"
                    onClick={decrement}
                >
                    -
                </button>
            </div>
            <div className="flex flex-col gap-2 ">
                <button 
                    className="w-24 bg-slate-700 text-white bg-gradient-to-r from-slate-400 to-slate-700 rounded-md py-1 px-2 hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-800 transition duration-300"
                    onClick={onAddClick}
                >
                    Agregar
                </button>
                <button 
                    className="w-24 bg-slate-700 text-white bg-gradient-to-r from-slate-400 to-slate-700 rounded-md py-1 px-2 hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-800 transition duration-300"
                    onClick={onAddClick}
                >
                    Volver
                </button>
            </div>

        </div>
    );
}
