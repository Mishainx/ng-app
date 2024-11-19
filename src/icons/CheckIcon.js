const CheckIcon = ({ width = 24, height = 24, className = "" }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className} // Aplica las clases aquí
      fill="currentColor" // Mantén este fill para que funcione con currentColor
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.0303 8.78039L8.99993 16.8107L5.4696 13.2804L6.53026 12.2197L8.99993 14.6894L15.9696 7.71973L17.0303 8.78039Z"
      />
    </svg>
  );
  
  export default CheckIcon;
  