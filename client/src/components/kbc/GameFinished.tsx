"use client";
import "@/styles/rain.css";
import { KBCContext } from "@/context/KBCContext";
import React, { FC, useContext, useState } from "react";
import TrophyCard from "./TrophyCard";

import { priceCounter, score, suffix } from "./PriceTable";

const GameFinished: FC<{ name: string }> = ({ name }) => {
  const { kbc } = useContext(KBCContext);

  return (
    <div className="fixed flex flex-col space-y-10 justify-center items-center top-0  left-0 h-screen w-screen z-50">
      <div className="confetti">
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
      </div>
      <h1 className="text-5xl font-bold subjective text-yellow-500">
        Game Finished
      </h1>
      <TrophyCard
        name={name}
        count={priceCounter[kbc.questionCounter]}
        suffix={suffix[kbc.questionCounter]}
        score={score[kbc.questionCounter]}
      />
    </div>
  );
};

export default GameFinished;
