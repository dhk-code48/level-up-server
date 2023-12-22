import GamesCard from "@/components/GameCard";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center flex-col background w-screen h-screen">
      <div>
        <Image src="/picture/Quizzy.gif" alt="Logo Of Quizzy Return" width={250} height={250} />
      </div>
      <div className="flex flex-wrap justify-center items-center gap-10">
        <Link href={"/quizzy/kbc"}>
          <GamesCard src="/picture/kbclogo.png" name="KBC" type="Quizzy Mods" />
        </Link>
        <Link href={"/quizzy/rapidfire"}>
          <GamesCard src="/picture/rapidfirelogo.png" name="RapidFire" type="Quizzy Mods" />
        </Link>{" "}
        <Link href={"/quizzy/quiz"}>
          <GamesCard src="/picture/quiz.png" name="Quiz" type="Quizzy Mods" />
        </Link>
        {/* <Link href={"/quizzy/rapidfire"}>
          <GamesCard src="/rapidfire/rapidfire.png" name="Quiz" type="Quizzy Mods" />
        </Link> */}
      </div>
    </div>
  );
};

export default page;
