"use client";
import React, { FC } from "react";

const QuestionCard: FC<{ question: string }> = ({ question }) => {
  return (
    <svg
      width="100%"
      height="88"
      className="animate-fade-up"
      viewBox="0 0 1256 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1060.64 4H168.719C159.481 4 150.529 7.19715 143.381 13.0486L107.405 42.5L143.316 74.0501C150.616 80.4632 160 84 169.717 84H1059.8C1069.54 84 1078.96 80.4417 1086.26 73.9935L1121.96 42.5L1085.98 13.0476C1078.83 7.1968 1069.88 4 1060.64 4Z"
        fill="url(#paint0_radial_6_14)"
      />
      <path
        d="M1 43L107.405 42.5M107.405 42.5L143.316 74.0501C150.616 80.4632 160 84 169.717 84H1059.8C1069.54 84 1078.96 80.4417 1086.26 73.9935L1121.96 42.5M107.405 42.5L143.381 13.0486C150.529 7.19715 159.481 4 168.719 4H1060.64C1069.88 4 1078.83 7.1968 1085.98 13.0476L1121.96 42.5M1121.96 42.5H1256"
        stroke="url(#paint1_radial_6_14)"
        strokeWidth="7"
      />
      <text
        x="50%"
        y="50%"
        width="88"
        className="whitespace-break-spaces max-w-2"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="24"
        fill="white"
      >
        {question}
      </text>
      <defs>
        <radialGradient
          id="paint0_radial_6_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(606.158 44) rotate(90) scale(45.5 688.368)"
        >
          <stop stopColor="#3F67A6" />
          <stop offset="1" stopColor="#002B6F" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_6_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(116.231 42.5002) scale(998.673 6147.05)"
        >
          <stop stopColor="#CDA23E" />
          <stop offset="0.491664" stopColor="#DCAE43" stopOpacity="0.7" />
          <stop offset="0.999588" stopColor="#CDA23E" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default QuestionCard;
