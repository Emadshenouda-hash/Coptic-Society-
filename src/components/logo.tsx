'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ size = 60, variant = 'full', theme = 'light', className }: LogoProps) {
  const primaryColor = theme === 'light' ? '#2C1810' : '#FDFBF7';
  const accentColor = '#D4A574';

  return (
    <div
      className={cn('flex flex-col items-center', className)}
      style={{ width: variant === 'full' ? size * 4 : size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="The Grand Coptic Benevolent Society Logo"
      >
        {/* Shield Frame */}
        <path
          d="M10 20C10 15 15 10 20 10H80C85 10 90 15 90 20V60C90 70 70 90 50 90C30 90 10 70 10 60V20Z"
          stroke={accentColor}
          strokeWidth="3"
        />
        <path
          d="M15 22C15 18.6863 17.6863 16 21 16H79C82.3137 16 85 18.6863 85 22V58C85 65.1797 69.4036 85 50 85C30.5964 85 15 65.1797 15 58V22Z"
          stroke={accentColor}
          strokeWidth="1"
        />

        {/* Laurel Branches */}
        <g opacity="0.3">
          <path
            d="M32 35C30 45 28 55 30 65"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M32 38C35 39 37 42 35 45"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M31 48C34 49 36 52 34 55"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M30.5 58C33.5 59 35.5 62 33.5 65"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        <g opacity="0.3" transform="scale(-1, 1) translate(-100, 0)">
          <path
            d="M32 35C30 45 28 55 30 65"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M32 38C35 39 37 42 35 45"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M31 48C34 49 36 52 34 55"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M30.5 58C33.5 59 35.5 62 33.5 65"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Coptic Cross */}
        <g fill={primaryColor}>
          {/* Main Cross */}
          <rect x="47" y="25" width="6" height="50" rx="1" />
          <rect x="35" y="47" width="30" height="6" rx="1" />
          {/* Cross ends */}
          <circle cx="50" cy="22" r="2.5" stroke={primaryColor} strokeWidth="1" fill="none" />
          <circle cx="50" cy="78" r="2.5" stroke={primaryColor} strokeWidth="1" fill="none" />
          <circle cx="32" cy="50" r="2.5" stroke={primaryColor} strokeWidth="1" fill="none" />
          <circle cx="68" cy="50" r="2.5" stroke={primaryColor} strokeWidth="1" fill="none" />
        </g>
        {/* Cross Center Circle */}
        <circle cx="50" cy="50" r="4" fill={accentColor} />

        {/* Year Text */}
        <text
          x="50"
          y="70"
          fontFamily="Cinzel, serif"
          fontSize="8"
          fill={accentColor}
          textAnchor="middle"
        >
          <tspan>• 1881 •</tspan>
        </text>
      </svg>

      {variant === 'full' && (
        <div className="mt-4 text-center">
          <p
            className="font-headline uppercase tracking-widest"
            style={{ color: primaryColor, fontSize: size * 0.2 }}
          >
            The Grand Coptic Benevolent Society
          </p>
          <p
            className="text-xs uppercase tracking-wider opacity-70"
            style={{ color: primaryColor, fontSize: size * 0.12 }}
          >
            Serving Egypt Since 1881
          </p>
          <div
            className="my-2 h-px w-20 mx-auto"
            style={{ backgroundColor: accentColor }}
          ></div>
          <p
            className="font-amiri text-2xl"
            style={{ color: accentColor, fontSize: size * 0.3 }}
          >
            الجمعية القبطية الخيرية الكبرى
          </p>
        </div>
      )}
    </div>
  );
}
