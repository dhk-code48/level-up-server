"use client";
import { KBCContext } from "@/context/KBCContext";
import React, { FC, useContext, useState } from "react";
import TrophyCard from "./TrophyCard";
import { SparkingBackground } from "../sparking-bg";

export const priceCounter = [
  "2",
  "2",
  "2",
  "2",
  "4",
  "4",
  "4",
  "4",
  "6",
  "6",
  "6",
  "6",
  "8",
  "8",
  "8",
  "8",
];
export const score = [
  "1,000",
  "2,000",
  "3,000",
  "5,000",
  "10,000",
  "20,000",
  "40,000",
  "80,000",
  "1,60,000",
  "3,20,000",
  "6,40,000",
  "12,50,000",
  "25,00,000",
  "50,00,000",
  "1 Crore",
  "7 Crore",
];
export const suffix = [
  "nd",
  "nd",
  "nd",
  "nd",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
];
const PriceTable: FC<{ name: string }> = ({ name }) => {
  const { kbc } = useContext(KBCContext);
  return (
    <SparkingBackground>
      <div className="fixed flex flex-col animate-fade-up space-y-10 justify-center items-center top-0 left-0 h-screen w-screen z-50">
        <h1 className="animate-fade-up animate-once text-5xl font-bold subjective text-yellow-500">
          Congrulation On
        </h1>
        <TrophyCard
          name={name}
          count={priceCounter[kbc.questionCounter]}
          suffix={suffix[kbc.questionCounter]}
          score={score[kbc.questionCounter]}
        />
        {/* {priceCounter.map((price, index) => {
        console.log("Price = >  ", price);
        return (
          <div key={price + index} className="mt-4 cursor-pointer hover:scale-105">
            <div
              className={`flex-col flex justify-center items-center ${
                kbc.questionCounter === index ? "text-yellow-500 font-bold" : "text-white"
              } ${kbc.questionCounter === index - 1 ? "text-green-500 font-bold" : "text-white"}`}
            >
              <h1>Rs. {price}</h1>
            </div>
          </div>
        );
      })} */}
      </div>
    </SparkingBackground>
  );
};

export default PriceTable;
