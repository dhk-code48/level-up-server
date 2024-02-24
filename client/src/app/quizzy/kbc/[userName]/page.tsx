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
import { LucideCheck, LucideHeart, LucideHeartCrack } from "lucide-react";

interface pageProps {
  params: {
    userName: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  const [questions, setQuestions] = useState<question[] | null>(null);

  const [pauseGame, setPauseGame] = useState<boolean>(false);
  const [finishGame, setFinishGame] = useState<boolean>(false);

  const [disableAllOption, setDisableAllOption] = useState<boolean>(false);
  const [questionCounter, steQuestionCounter] = useState<number>(0);
  const [bgColors, setBgColors] = useState<string[]>([
    "none",
    "none",
    "none",
    "none",
  ]);

  const [fiftyfiftyLifeLine, setFiftyFiftyLifeLine] = useState<boolean>(false);

  const [heartLifeLine, setHeartifeLine] = useState<boolean>(true);

  useEffect(() => {
    const questionsRef = ref(db, "questions");

    onValue(questionsRef, (snapshot) => {
      const data: Question[] = snapshot.val();
      const moderateQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "moderate")
      ).slice(0, 4);
      const hardQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "hard")
      ).slice(0, 4);
      const extremeQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "extreme")
      ).slice(0, 4);
      const extremeHardQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "extremeHard")
      ).slice(0, 4);

      setQuestions(() => [
        ...moderateQuestions,
        ...hardQuestions,
        ...extremeQuestions,
        ...extremeHardQuestions,
      ]);
    });
  }, []);

  function handleOptionClick(correct: boolean, index: number) {
    console.log(correct);
    if (correct) {
      let bg = [...bgColors];
      bg[0] = "none";
      bg[1] = "none";
      bg[2] = "none";
      bg[3] = "none";
      bg[index] = "green";
      setBgColors(bg);
      setDisableAllOption(true);

      setTimeout(() => {
        setPauseGame(true);
      }, 1000);
      setTimeout(() => {
        steQuestionCounter((prev) => {
          if (prev + 1 === 16) {
            setFinishGame(true);
            return 0;
          } else {
            return prev + 1;
          }
        });
        setDisableAllOption(false);
        setBgColors(["none", "none", "none", "none"]);
        setPauseGame(false);
      }, 3000);
    } else if (heartLifeLine) {
      let bg = [...bgColors];
      bg[0] = "none";
      bg[1] = "none";
      bg[2] = "none";
      bg[3] = "none";
      bg[index] = "red";
      setBgColors(bg);
      setDisableAllOption(true);

      setTimeout(() => {
        setPauseGame(true);
      }, 1000);
      setTimeout(() => {
        steQuestionCounter((prev) => {
          if (prev + 1 === 16) {
            setFinishGame(true);
            return 0;
          } else {
            return prev + 1;
          }
        });
        setDisableAllOption(false);
        setBgColors(["none", "none", "none", "none"]);
        setPauseGame(false);
        setHeartifeLine(false);
      }, 3000);
    } else {
      let bg = [...bgColors];
      bg[0] = "none";
      bg[1] = "none";
      bg[2] = "none";
      bg[3] = "none";
      bg[index] = "red";
      setBgColors(bg);

      setTimeout(() => {
        setPauseGame(false);
        setFinishGame(true);
        setBgColors(["none", "none", "none", "none"]);
      }, 2000);
    }
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     kbc.setTimer(true);
  //   }, 32000);
  // }, []);

  const [startTimer, setStartTimer] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (!pauseGame && !finishGame && questions && startTimer) {
      setTimer(30);
      intervalId = setInterval(() => {
        if (timer !== 0) {
          setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    }
    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts or conditions change
    };
  }, [pauseGame, finishGame, questions]);

  useEffect(() => {
    if (timer === 0 && questions) {
      handleOptionClick(
        true,
        parseInt(questions[questionCounter].correctAnswer)
      );
      if (heartLifeLine) {
        let bg = [...bgColors];
        bg[0] = "none";
        bg[1] = "none";
        bg[2] = "none";
        bg[3] = "none";
        bg[parseInt(questions[questionCounter].correctAnswer)] = "green";
        setBgColors(bg);
        setDisableAllOption(true);

        setTimeout(() => {
          setPauseGame(true);
        }, 1000);
        setTimeout(() => {
          steQuestionCounter((prev) => {
            if (prev + 1 === 16) {
              setFinishGame(true);
              return 0;
            } else {
              return prev + 1;
            }
          });
          setTimer(30);
          setDisableAllOption(false);
          setBgColors(["none", "none", "none", "none"]);
          setPauseGame(false);
          setHeartifeLine(false);
        }, 3000);
      } else {
        setTimeout(() => setFinishGame(true), 1000);
      }
    }
  }, [timer, questions]);

  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    setSliderWidth((timer / 30) * 100);
  }, [timer]);
  function getRandomIndex(max: number, correct: number) {
    let random = Math.floor(Math.random() * max);
    if (random === correct) {
      return getRandomIndex(max, correct);
    } else {
      return random;
    }
  }

  function handleFiftyFifty() {
    if (questions && questions[questionCounter]) {
      const currentQuestion = { ...questions[questionCounter] };
      const optionsCopy = [...currentQuestion.options];

      // Find the index of the correct answer
      const correctAnswerIndex = parseInt(currentQuestion.correctAnswer);

      // Generate two random indexes different from the correct answer index
      let randomIndex1, randomIndex2;
      do {
        randomIndex1 = getRandomIndex(optionsCopy.length, correctAnswerIndex);
      } while (randomIndex1 === correctAnswerIndex);

      do {
        randomIndex2 = getRandomIndex(optionsCopy.length, correctAnswerIndex);
      } while (
        randomIndex2 === correctAnswerIndex ||
        randomIndex2 === randomIndex1
      );

      // Remove the options at the generated indexes
      optionsCopy[randomIndex1] = "";
      optionsCopy[randomIndex2] = "";

      // Update the current question with the modified options
      currentQuestion.options = optionsCopy;

      // Update the questions array with the modified question
      const updatedQuestions = [...questions];
      updatedQuestions[questionCounter] = currentQuestion;

      // Set the updated questions and activate the lifeline
      setQuestions(updatedQuestions);
      setFiftyFiftyLifeLine(true);
    }
  }

  return (
    <div>
      {/* <KBCIntro /> */}
      {!finishGame && pauseGame && <PriceTable name={params.userName} />}
      {finishGame ? (
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

          {!pauseGame && questions && (
            <div className="z-20 flex flex-col justify-end items-center h-screen pb-32 animate-fade-up">
              <div className="flex gap-x-10">
                <button className="bg-[#204A8B] border-4 border-[#AA9049] h-15 lg:w-24 w-15 p-5 lg:p-0 lg:pb-1 timer cursor-pointer mb-0 font-bold text-lg  flex items-center lg:items-end justify-center rounded-b-full lg:rounded-b-none rounded-t-full ">
                  {heartLifeLine ? <LucideHeart /> : <LucideHeartCrack />}
                </button>
                <div className="h-12 lg:w-20 bg-[#204A8B] border-4 border-[#AA9049] w-12 p-5 lg:p-0 lg:pb-1 timer cursor-pointer mb-0 font-bold text-lg  flex items-center lg:items-end justify-center rounded-b-full lg:rounded-b-none rounded-t-full">
                  <p className="animate-ping animate-infinite animate-duration-1000  animate-delay-1000 animate-ease-linear animate-normal">
                    {timer}
                  </p>
                </div>
                <button
                  onClick={handleFiftyFifty}
                  disabled={fiftyfiftyLifeLine}
                  className="bg-[#204A8B] border-4 border-[#AA9049] h-15 lg:w-24 w-15 p-5 lg:p-0 lg:pb-1 timer cursor-pointer mb-0 font-bold text-lg  flex items-center lg:items-end justify-center rounded-b-full lg:rounded-b-none rounded-t-full "
                >
                  {fiftyfiftyLifeLine ? <LucideCheck /> : <p>50 / 50</p>}
                </button>
              </div>
              <QuestionCard question={questions[questionCounter].question} />
              <div className="mt-0 lg:mt-10 cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-y-0 lg:gap-y-5">
                <div
                  onClick={() =>
                    handleOptionClick(
                      parseInt(questions[questionCounter].correctAnswer) === 0,
                      0
                    )
                  }
                >
                  <OptionCard
                    option={questions[questionCounter].options[0]}
                    bgColor={bgColors[0]}
                  />
                </div>
                <div
                  onClick={() =>
                    handleOptionClick(
                      parseInt(questions[questionCounter].correctAnswer) === 1,
                      1
                    )
                  }
                >
                  <OptionCard
                    option={questions[questionCounter].options[1]}
                    bgColor={bgColors[1]}
                  />
                </div>
                <div
                  onClick={() =>
                    handleOptionClick(
                      parseInt(questions[questionCounter].correctAnswer) === 2,
                      2
                    )
                  }
                >
                  <OptionCard
                    option={questions[questionCounter].options[2]}
                    bgColor={bgColors[2]}
                  />
                </div>
                <div
                  onClick={() =>
                    handleOptionClick(
                      parseInt(questions[questionCounter].correctAnswer) === 3,
                      3
                    )
                  }
                >
                  <OptionCard
                    option={questions[questionCounter].options[3]}
                    bgColor={bgColors[3]}
                  />
                </div>
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
