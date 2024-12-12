
import SpinnerIcon from "@/icons/SpinnerIcon";

const ButtonWithSpinner = ({
    isLoading,
    label,
    primaryColor = "#ffffff",
    secondaryColor = "rgba(255, 255, 255, 0.5)",
    onClick,
    loadingText = "Cargando...",
    disabled = false,
    width = "auto", // Permitir personalizar el ancho del botón
    height = "auto", // Permitir personalizar la altura del botón
    padding = "py-1 px-6", // Permitir personalizar el padding (espaciado interior)
    fontSize = "text-base", // Permitir personalizar el tamaño de fuente
}) => {
    return (
        <button
            type="button"
            className={`bg-red-500 text-white rounded hover:bg-red-700 flex items-center justify-center ${padding} ${fontSize}`}
            style={{ width, height }}
            disabled={isLoading || disabled}
            onClick={onClick}
        >
            {isLoading ? (
                <>
                    <SpinnerIcon 
                        primaryColor={primaryColor} 
                        secondaryColor={secondaryColor} 
                        width={20} 
                        height={20} 
                        className="animate-spin"
                    />
                    <span className="ml-2">{loadingText}</span>
                </>
            ) : (
                label || "Acción"
            )}
        </button>
    );
};

export default ButtonWithSpinner;

