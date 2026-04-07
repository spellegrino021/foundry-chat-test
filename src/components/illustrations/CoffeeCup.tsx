export function CoffeeCup() {
  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Saucer */}
      <ellipse
        cx="90"
        cy="138"
        rx="80"
        ry="14"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="rgba(107,58,42,0.03)"
      />
      {/* Saucer inner rim */}
      <ellipse
        cx="90"
        cy="135"
        rx="55"
        ry="9"
        stroke="#6B3A2A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Cup body */}
      <path
        d="M42 75 C40 72, 38 70, 40 68 L44 65 C46 63, 50 62, 55 62 L125 62 C130 62, 134 63, 136 65 L140 68 C142 70, 141 72, 138 75 L130 125 C128 130, 122 133, 115 134 L65 134 C58 133, 52 130, 50 125 Z"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(107,58,42,0.03)"
      />
      {/* Cup rim */}
      <ellipse
        cx="90"
        cy="63"
        rx="50"
        ry="8"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="rgba(107,58,42,0.02)"
      />
      {/* Handle */}
      <path
        d="M140 78 C155 76, 168 82, 170 96 C172 110, 162 120, 148 122 L138 118"
        stroke="#6B3A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Steam lines */}
      <path
        d="M72 48 C70 38, 75 30, 73 20"
        stroke="#6B3A2A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M90 45 C92 35, 88 28, 90 18"
        stroke="#6B3A2A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M108 48 C106 38, 110 30, 108 22"
        stroke="#6B3A2A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
    </svg>
  );
}
