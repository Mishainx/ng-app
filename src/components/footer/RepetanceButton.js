import Link from "next/link";


//Botón de arrepentimiento
const RepetanceButton = () => {
    return (
        <Link href="/arrepentimiento">
        <button
            className="text-xs text-grey-400 px-2 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300"
        >
            Botón de arrepentimiento
        </button>
        
        </Link>

    );
  };

  export default RepetanceButton;