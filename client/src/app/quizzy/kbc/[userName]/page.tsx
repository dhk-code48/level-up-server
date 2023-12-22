"use client";
import "@/styles/trophytable.css";
import KBCIntro from "@/components/kbc/Intro";
import LifeLine from "@/components/kbc/LifeLine";
import OptionCard from "@/components/kbc/OptionCard";
import PriceTable from "@/components/kbc/PriceTable";
import QuestionCard from "@/components/kbc/QuestionCard";
import Timer from "@/components/kbc/Timer";
import { KBCContext } from "@/context/KBCContext";
import { db } from "@/firebase/config";
import getKBCQuestions from "@/firebase/getKBCQuestions";
import { onValue, ref } from "firebase/database";
import { shuffle } from "lodash";
import Image from "next/image";
import React, { FC, useContext, useEffect, useState } from "react";
import GameFinished from "@/components/kbc/GameFinished";

interface pageProps {
  params: {
    userName: string;
  };
}
export interface KBCQuestions {
  level: "easy" | "moderate" | "hard" | "extreme";
  question: string;
  options: string[];
  correctAnswer: number;
}

const page: FC<pageProps> = ({ params }) => {
  const { kbc } = useContext(KBCContext);

  useEffect(() => {
    const questionsRef = ref(db, "kbc/questions");

    onValue(questionsRef, (snapshot) => {
      const data: KBCQuestions[] = snapshot.val();
      const easyQuestions: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "easy")
      ).slice(0, 4);
      const moderateQuestion: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "moderate")
      ).slice(0, 4);
      const hardQuestions: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "hard")
      ).slice(0, 4);
      const extremeQuestions: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "extreme")
      ).slice(0, 4);
      kbc.setQuestions([
        ...easyQuestions,
        ...moderateQuestion,
        ...hardQuestions,
        ...extremeQuestions,
      ]);
    });
  }, []);

  useEffect(() => {
    console.log("questions", kbc.questions);
  }, [kbc.questions]);

  useEffect(() => {
    setTimeout(() => {
      kbc.setTimer(true);
    }, 32000);
  }, []);

  return (
    <div>
      {/* <KBCIntro /> */}
      {kbc.pauseGame && <PriceTable name={params.userName} />}
      {kbc.finishGame ? (
        <GameFinished name={params.userName} />
      ) : (
        <>
          <div className="fixed top-0 left-0 -z-20">
            <Image
              src={"/picture/kbc-bg.png"}
              width={1920}
              className="h-screen w-screen object-cover bg-blend-overlay"
              height={1080}
              alt="gif background"
            />
          </div>
          <div className="bg-black bg-opacity-80 -z-10  fixed top-0 left-0 w-full h-full"></div>

          {kbc.questions.length > 0 && (
            <div className="z-20 flex flex-col justify-end items-center h-screen pb-32">
              <div className="flex gap-x-10">
                <LifeLine type="askHost" />
                <Timer />
                <LifeLine type="fiftyfifty" />
              </div>
              <QuestionCard question={kbc.questions[kbc.questionCounter].question} />
              <div className="mt-0 lg:mt-10 cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-y-0 lg:gap-y-5">
                <OptionCard
                  option={kbc.questions[kbc.questionCounter].options[0]}
                  correct={kbc.questions[kbc.questionCounter].correctAnswer === 0}
                />
                <OptionCard
                  option={kbc.questions[kbc.questionCounter].options[1]}
                  correct={kbc.questions[kbc.questionCounter].correctAnswer === 1}
                />
                <OptionCard
                  option={kbc.questions[kbc.questionCounter].options[2]}
                  correct={kbc.questions[kbc.questionCounter].correctAnswer === 2}
                />
                <OptionCard
                  option={kbc.questions[kbc.questionCounter].options[3]}
                  correct={kbc.questions[kbc.questionCounter].correctAnswer === 3}
                />
              </div>
              <div className="cursor-pointer"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default page;
