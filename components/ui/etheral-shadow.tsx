'use client';

import { useId, CSSProperties } from 'react';

interface AnimationConfig { scale: number; speed: number; }
interface NoiseConfig { opacity: number; scale: number; }
interface EtherealShadowProps {
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
}

function mapRange(v: number, a: number, b: number, c: number, d: number) {
  if (a === b) return c;
  return c + ((v - a) / (b - a)) * (d - c);
}

export function EtherealShadow({ color = 'rgba(128,128,128,1)', animation, noise, style, className }: EtherealShadowProps) {
  const id = `es-${useId().replace(/:/g, '')}`;
  const animEnabled = !!(animation && animation.scale > 0);

  // quadratic ease so high speed values get much shorter durations
  const duration     = animation ? Math.pow(1 - (animation.speed - 1) / 99, 2) * 39.5 + 0.5 : 10;
  const displacement = animation ? mapRange(animation.scale, 1, 100, 10, 140)      : 0;
  const freqX        = animation ? mapRange(animation.scale, 0, 100, 0.002, 0.009) : 0.004;
  const freqY        = animation ? mapRange(animation.scale, 0, 100, 0.003, 0.013) : 0.006;
  const blurPx       = animation ? mapRange(animation.scale, 0, 100, 2, 14)        : 4;
  const transparent  = color.replace(/[\d.]+\)$/, '0)');

  return (
    <div className={className} style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%', ...style }}>
      {/* Filter def as sibling — never inside the filtered element */}
      <svg aria-hidden style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id={id} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" numOctaves="3"
              baseFrequency={`${freqX} ${freqY}`} result="noise" />
            <feColorMatrix in="noise" type="hueRotate" values="0" result="rotated">
              {animEnabled && (
                <animate attributeName="values" from="0" to="360"
                  dur={`${duration}s`} repeatCount="indefinite" />
              )}
            </feColorMatrix>
            <feDisplacementMap in="SourceGraphic" in2="rotated"
              scale={displacement} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Soft gradient blob displaced by the filter above */}
      <div style={{
        position: 'absolute',
        inset: animEnabled ? -displacement : 0,
        filter: `url(#${id}) blur(${blurPx}px)`,
        background: `radial-gradient(ellipse 68% 58% at 50% 50%, ${color} 0%, ${color} 18%, ${transparent} 68%)`,
      }} />

      {noise && noise.opacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: `${Math.round(noise.scale * 160)}px`,
          backgroundRepeat: 'repeat',
          opacity: noise.opacity * 0.12,
          mixBlendMode: 'overlay',
        }} />
      )}
    </div>
  );
}
