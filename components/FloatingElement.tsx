
import React from 'react';

interface FloatingElementProps {
  type: string;
  style: React.CSSProperties;
  animationClass?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({ type, style, animationClass = 'animate-float' }) => {
  const renderElement = () => {
    switch (type) {
      case 'petal':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fb7185">
            <path d="M12,2C12,2 6,8 6,12C6,16 9,19 12,19C15,19 18,16 18,12C18,8 12,2 12,2Z" />
          </svg>
        );
      case 'diya':
        return (
          <div className="relative">
            <div className="w-8 h-4 bg-orange-900 rounded-b-full shadow-lg border-t border-orange-700"></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-5 bg-yellow-400 rounded-full blur-[2px] animate-pulse"></div>
          </div>
        );
      case 'chakra':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000080" strokeWidth="1" className="animate-spin-slow">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="2" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={i} x1="12" y1="12" x2={12 + 10 * Math.cos((i * 15 * Math.PI) / 180)} y2={12 + 10 * Math.sin((i * 15 * Math.PI) / 180)} />
            ))}
          </svg>
        );
      case 'trishul':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#60a5fa">
            <path d="M12,2L12,22M12,2L10,6M12,2L14,6M7,7C7,7 7,12 12,12C17,12 17,7 17,7" stroke="#60a5fa" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'splash':
        return (
          <div className="w-6 h-6 rounded-full blur-md" style={{ backgroundColor: style.color || '#ec4899' }}></div>
        );
      case 'lotus':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fef3c7">
            <path d="M12,22C12,22 16,18 16,14C16,10 12,6 12,6C12,6 8,10 8,14C8,18 12,22 12,22Z" />
            <path d="M12,22C12,22 20,20 20,14C20,8 12,6 12,6C12,6 4,8 4,14C4,20 12,22 12,22Z" opacity="0.5" />
          </svg>
        );
      case 'snow':
        return (
          <div className="w-2 h-2 bg-white rounded-full blur-[1px] animate-pulse"></div>
        );
      case 'sparkle':
        return (
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-ping"></div>
        );
      default:
        return <div className="w-2 h-2 bg-amber-500 rounded-full"></div>;
    }
  };

  return (
    <div className={`absolute pointer-events-none opacity-40 ${animationClass}`} style={style}>
      {renderElement()}
    </div>
  );
};
