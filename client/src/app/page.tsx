import GameCard from "@/components/GameCard";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="background w-screen h-screen pt-20 space-y-20">
      <h1 className="text-center text-5xl lg:text-6xl font-bold text-white">FrenzyHub</h1>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-10">
        <Link href={"/quizzy"}>
          <GameCard name="Quizzy" src="/picture/quiz.png" type="Quiz" />
        </Link>
        <Link href={"/guessthesong"}>
          <GameCard name="Guess The Song" src="/picture/guesssonglogo.jpg" type="Music" />
        </Link>
      </div>
    </div>
  );
}
