export function CoffeeBag() {
  return (
    <svg
      width="180"
      height="220"
      viewBox="0 0 180 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bag body */}
      <path
        d="M30 45 C28 44, 27 46, 28 48 L25 195 C24 198, 26 201, 30 202 L150 204 C154 204, 156 201, 155 198 L152 48 C153 45, 151 43, 148 44 Z"
        stroke="#8A8A3A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(138,138,58,0.03)"
      />
      {/* Bag top fold */}
      <path
        d="M32 45 C33 30, 35 22, 50 18 C65 14, 75 13, 90 12 C105 13, 120 14, 132 18 C145 22, 147 30, 148 45"
        stroke="#8A8A3A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Fold crease */}
      <path
        d="M38 38 C60 33, 120 33, 142 38"
        stroke="#8A8A3A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Label area */}
      <rect
        x="48"
        y="72"
        width="84"
        height="90"
        rx="3"
        stroke="#8A8A3A"
        strokeWidth="1"
        fill="rgba(138,138,58,0.04)"
      />
      {/* COFFEE text */}
      <text
        x="90"
        y="98"
        textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="16"
        fill="#8A8A3A"
        letterSpacing="2"
      >
        COFFEE
      </text>
      {/* Beans text */}
      <text
        x="90"
        y="116"
        textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="12"
        fill="#8A8A3A"
        letterSpacing="3"
      >
        Beans
      </text>
      {/* Coffee bean icon */}
      <g transform="translate(78, 125)">
        <ellipse
          cx="12"
          cy="14"
          rx="10"
          ry="13"
          stroke="#8A8A3A"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(-15, 12, 14)"
        />
        <path
          d="M8 5 C10 14, 10 18, 7 26"
          stroke="#8A8A3A"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
