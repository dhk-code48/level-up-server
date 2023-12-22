import Image from "next/image";
import "@/styles/gamescard.css";

import React, { FC } from "react";

const GamesCard: FC<{ src: string; type: string; name: string }> = ({ src, type, name }) => {
  return (
    <div className="card">
      <div className="card-info">
        <div className="card__img w-[500px] h-[500px] overflow-visible">
          <Image
            src={src}
            className="h-full w-full object-cover"
            width={200}
            height={200}
            alt="kbc"
          />
        </div>
        <div className="card__subtitle">{type}</div>
        <div className="card__wrapper">
          <div className="card__title">{name}</div>
          <div className="card__icon">
            <svg
              color="rgb(224, 223, 220)"
              style={{}}
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g color="rgb(224, 223, 220)">
                <circle opacity="0.2" r="96" cy="128" cx="128"></circle>
                <circle
                  stroke-width="16"
                  stroke-miterlimit="10"
                  stroke="rgb(224, 223, 220)"
                  fill="none"
                  r="96"
                  cy="128"
                  cx="128"
                ></circle>
                <polyline
                  stroke-width="16"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke="rgb(224, 223, 220)"
                  fill="none"
                  points="134.1 161.9 168 128 134.1 94.1"
                ></polyline>
                <line
                  stroke-width="16"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke="rgb(224, 223, 220)"
                  fill="none"
                  y2="128"
                  x2="168"
                  y1="128"
                  x1="88"
                ></line>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesCard;
