"use client";
import { KBCContext } from "@/context/KBCContext";
import React, { FC, useContext, useState } from "react";

const OptionCard: FC<{ option: string; bgColor: string }> = ({
  option,
  bgColor,
}) => {
  return (
    <svg
      width="100%"
      height="60"
      viewBox="0 0 755 54"
      className="options__svg"
      fill={bgColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="option-card-svg"
        d="M139.839 11.1412L123.5 26.5L139.751 42.4264C145.359 47.9219 152.898 51 160.749 51H597.015C605.3 51 613.217 47.5736 618.887 41.5331L633 26.5L618.824 12.0161C613.181 6.24993 605.453 3 597.384 3H160.386C152.751 3 145.403 5.91149 139.839 11.1412Z"
        fill="url(#paint0_radial_6_16)"
      />
      <path
        d="M0 26.5H123.5M123.5 26.5L139.839 11.1412C145.403 5.91149 152.751 3 160.386 3H597.384C605.453 3 613.181 6.24993 618.824 12.0161L633 26.5M123.5 26.5L139.751 42.4264C145.359 47.9219 152.898 51 160.749 51H597.015C605.3 51 613.217 47.5736 618.887 41.5331L633 26.5M633 26.5H629.5M633 26.5H754.5"
        stroke="url(#paint1_radial_6_16)"
        strokeWidth="5"
      />

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        className="animate-fade-up"
        textAnchor="middle"
        fontSize="20"
        fill="white"
      >
        {option}
      </text>
      <defs>
        <radialGradient
          id="paint0_radial_6_16"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(305.231 27) rotate(90) scale(27.3 347.201)"
        >
          <stop stopColor="#3F67A6" />
          <stop offset="1" stopColor="#002B6F" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_6_16"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(58.1207 26.1001) scale(503.713 3688.23)"
        >
          <stop stopColor="#CDA23E" />
          <stop offset="0.491664" stopColor="#DCAE43" stopOpacity="0.7" />
          <stop offset="0.999588" stopColor="#CDA23E" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default OptionCard;
