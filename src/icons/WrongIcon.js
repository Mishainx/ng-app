const WrongIcon = ({ width = 24, height = 24, className = "" }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className} // Aplica las clases aquí
      fill="currentColor" // Mantén este fill para que funcione con currentColor
    >
      <path
        d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z"
      />
    </svg>
  );
  
  export default WrongIcon;
  