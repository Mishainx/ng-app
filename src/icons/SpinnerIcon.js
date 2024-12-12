const SpinnerIcon = ({ primaryColor = "#000000", secondaryColor = "rgba(0, 0, 0, 0.1)", width = 24, height = 24, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin ${className}`} // Añadido animate-spin
    >
      <g fill="none" fillRule="evenodd">
        {/* Outer circle */}
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke={secondaryColor}
          strokeWidth="2"
        />
        {/* Spinning arc */}
        <path
          fill={primaryColor}
          fillRule="nonzero"
          d="M7 0a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5V0z"
        />
      </g>
    </svg>
  );
};

export default SpinnerIcon;
