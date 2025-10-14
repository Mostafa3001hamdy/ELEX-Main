import React from 'react';

interface XLogoProps {
  className?: string;
}

const XLogo: React.FC<XLogoProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.8 10.2L20.4 2h-1.6l-5.7 6.6L8.4 2H2l6.9 10-6.9 8h1.6l6-7 4.9 7h6.4l-7.2-10.8zM4.4 3.4h2.9L19.6 20h-2.9L4.4 3.4z"/>
    </svg>
  );
};

export default XLogo;