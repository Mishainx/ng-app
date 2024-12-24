import React from 'react';

const CancelIcon = ({ width = "800px", height = "800px", className = "" }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className={`fill-current ${className}`} // Añadido fill-current para permitir que el color se aplique
        >
            <title>Cancel</title>
            <g fill="none" fillRule="evenodd">
                <g fill="currentColor" transform="translate(91.52, 91.52)">
                    <polygon points="328.96 30.2933333 298.666667 0 164.48 134.4 30.2933333 0 0 30.2933333 134.4 164.48 0 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48" />
                </g>
            </g>
        </svg>
    );
};

export default CancelIcon;
