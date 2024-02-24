import { GameCard } from "@/components/GameCard";
import { SparkingBackground } from "@/components/sparking-bg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <SparkingBackground>
      <div className="flex items-center flex-col w-screen h-screen space-y-10 pt-20 subjective">
        <h1 className="text-5xl font-bold tracking-wider text-white animate-bounce animate-infinite">
          Level Up
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-10">
          <GameCard
            picture="/picture/kbclogo.png"
            name="KBC"
            link="/quizzy/kbc"
          />

          <GameCard
            picture="/picture/rapidfirelogo.png"
            name="RapidFire"
            link="/quizzy/rapidfire"
          />

          <GameCard
            picture="/picture/quiz.png"
            name="Quiz"
            link="/quizzy/quiz"
          />

          {/* <Link href={"/quizzy/rapidfire"}>
          <GamesCard src="/rapidfire/rapidfire.png" name="Quiz" type="Quizzy Mods" />
        </Link> */}
        </div>
      </div>
    </SparkingBackground>
  );
};

export default page;
