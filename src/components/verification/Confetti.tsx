import { useMemo } from 'react';

export function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        left: `${(i * 37 + 13) % 100}%`,
        top: `${(i * 23 + 7) % 50}%`,
        delay: `${(i * 0.04) % 1}s`,
        duration: `${1.2 + (i % 5) * 0.3}s`,
        color: ['#818cf8', '#a78bfa', '#c084fc', '#f472b6', '#34d399', '#fbbf24', '#60a5fa'][i % 7],
        rotation: `${(i * 51) % 360}deg`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}
        >
          <div
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: p.color, transform: `rotate(${p.rotation})` }}
          />
        </div>
      ))}
    </div>
  );
}
