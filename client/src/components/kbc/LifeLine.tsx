"use client";
import { KBCContext } from "@/context/KBCContext";
import { LucideCheck, LucideUser } from "lucide-react";
import React, { FC, useContext, useEffect, useState } from "react";

const LifeLine: FC<{ type: "askHost" | "fiftyfifty" }> = ({ type }) => {
  const { kbc } = useContext(KBCContext);

  function getRandomIndex(max: number, correct: number) {
    let random = Math.floor(Math.random() * max);
    if (random === correct) {
      return getRandomIndex(max, correct);
    } else {
      return random;
    }
  }
  const handleLifeLine = () => {
    if (type === "fiftyfifty" && kbc.questions.length > 0) {
      kbc.setQuestions((prev) => {
        const updatedQuestions = [...prev];
        const currentQuestion = { ...updatedQuestions[kbc.questionCounter] };
        const optionsCopy = currentQuestion.options.slice();

        // Generate one unique random index to empty a string
        let randomIndex1 = getRandomIndex(optionsCopy.length, currentQuestion.correctAnswer);

        let randomIndex2 = getRandomIndex(optionsCopy.length, currentQuestion.correctAnswer);

        // Empty one random string in the options array
        optionsCopy[randomIndex1] = "";
        optionsCopy[randomIndex2] = "";

        // Update the options in the current question
        currentQuestion.options = optionsCopy;

        // Update the question in the array
        updatedQuestions[kbc.questionCounter] = currentQuestion;

        return updatedQuestions;
      });

      // Disable the lifeline after using it
      kbc.lifelines.setFiftyFifty(false);
    }
  };

  return (
    <button
      onClick={handleLifeLine}
      disabled={!kbc.lifelines[type]}
      className="h-15 lg:w-20 w-15 disabled:bg-gray-500 p-5 lg:p-0 lg:pb-1 timer cursor-pointer mb-0 font-bold text-lg  flex items-center lg:items-end justify-center rounded-b-full lg:rounded-b-none rounded-t-full "
    >
      <div>
        {type === "askHost" ? (
          kbc.lifelines.askHost ? (
            <LucideUser />
          ) : (
            <LucideCheck />
          )
        ) : kbc.lifelines.fiftyfifty ? (
          50 + "/" + 50
        ) : (
          <LucideCheck />
        )}
      </div>
    </button>
  );
};

export default LifeLine;
