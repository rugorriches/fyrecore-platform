/**
 * FyreCore mark. Vector rebuild of the flame-F so it stays sharp at 24px in a
 * nav bar, where the raster render turns to mush. The flat variant inherits
 * currentColor; the default carries the magma-to-forge heat.
 */
export default function Mark({ size = 30, flat = false, id = 'fc' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
         aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      {!flat && (
        <defs>
          <linearGradient id={`${id}-heat`} x1="10" y1="6" x2="80" y2="98" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFD97A" />
            <stop offset=".38" stopColor="#FFC24A" />
            <stop offset=".78" stopColor="#FF4423" />
            <stop offset="1" stopColor="#C8180A" />
          </linearGradient>
          <linearGradient id={`${id}-face`} x1="20" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3A3547" />
            <stop offset="1" stopColor="#16141E" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      )}
      <g filter={flat ? undefined : `url(#${id}-glow)`}>
        <path d="M14 36 L92 4 L74 32 L32 50 Z"
              fill={flat ? 'currentColor' : `url(#${id}-face)`}
              stroke={flat ? 'none' : `url(#${id}-heat)`} strokeWidth="3.4" strokeLinejoin="round" />
        <path d="M40 58 L84 40 L70 62 L50 71 Z"
              fill={flat ? 'currentColor' : `url(#${id}-face)`}
              stroke={flat ? 'none' : `url(#${id}-heat)`} strokeWidth="3.4" strokeLinejoin="round" />
        <path d="M14 36 L32 50 L44 46 L20 98 Z"
              fill={flat ? 'currentColor' : `url(#${id}-face)`}
              stroke={flat ? 'none' : `url(#${id}-heat)`} strokeWidth="3.4" strokeLinejoin="round" />
      </g>
    </svg>
  );
}