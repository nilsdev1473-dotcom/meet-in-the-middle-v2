"use client";

export type SpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

export function LoadingSpinner({ size = "md", color = "currentColor" }: LoadingSpinnerProps) {
  const px = sizeMap[size];
  const stroke = size === "sm" ? 2 : size === "md" ? 2.5 : 3;
  const r = (px - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const dashArray = `${circumference * 0.75} ${circumference * 0.25}`;

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      aria-label="Loading"
      role="status"
      style={{
        animation: "spin 0.8s linear infinite",
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg[role="status"] {
            animation-duration: 0.001ms;
          }
        }
      `}</style>
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        opacity={0.25}
      />
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
