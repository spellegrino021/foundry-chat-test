export function CoffeeBowl() {
  return (
    <svg
      width="170"
      height="140"
      viewBox="0 0 170 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Saucer */}
      <ellipse
        cx="78"
        cy="118"
        rx="70"
        ry="12"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="rgba(107,58,42,0.03)"
      />
      {/* Bowl body - wide and round */}
      <path
        d="M18 62 C16 58, 18 55, 22 54 L134 54 C138 55, 140 58, 138 62 L128 105 C125 112, 115 116, 100 117 L56 117 C41 116, 31 112, 28 105 Z"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(107,58,42,0.03)"
      />
      {/* Bowl rim */}
      <ellipse
        cx="78"
        cy="55"
        rx="60"
        ry="10"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="rgba(107,58,42,0.02)"
      />
      {/* Handle - small ear handle on right */}
      <path
        d="M138 66 C150 64, 158 72, 157 82 C156 92, 148 96, 138 94"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Latte art - simple rosetta swirl */}
      <path
        d="M78 52 C72 56, 68 60, 72 64 C76 68, 82 66, 78 62 C74 58, 80 54, 84 58 C88 62, 82 68, 78 64"
        stroke="#6B3A2A"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      {/* Steam wisps */}
      <path
        d="M62 40 C60 30, 65 22, 63 14"
        stroke="#6B3A2A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M85 38 C87 28, 83 22, 85 14"
        stroke="#6B3A2A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
