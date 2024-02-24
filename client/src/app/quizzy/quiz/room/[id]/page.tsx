"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/context/ContextProvider";
import { Button } from "@/components/ui/button";
import RoomMembers from "@/components/rapidfire/RoomMembers";
import Game from "@/components/rapidfire/Game";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/firebase/config";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import "@/styles/rain.css";
import TrophyCard from "@/components/kbc/TrophyCard";
const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-paint-io.onrender.com"
    : "http://129.150.50.164:3001";

const socket = io(serverUrl);

interface ParamsProps {
  params: RoomProps;
}

const Room = ({ params }: ParamsProps) => {
  const { user, setUser } = useContext(UserContext);
  const [chosenQuestionIndex, setChosenQuestionIndex] = useState<number[]>([]);

  const roomId = params.id;
  const [membersState, setMembersState] = useState<string[]>([]);
  const membersRef = useRef<string[]>([]);
  const router = useRouter();

  const [startGame, setStartGame] = useState<boolean>(false);
  const [finishGame, setFinishGame] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [bgColors, setBgColors] = useState<string[]>([
    "#ff996d",
    "#ffea00",
    "#bcffdd",
    "#0aefff",
  ]);
  const [answerBy, setAnswerBy] = useState<{ index: number; name: string }>({
    index: 0,
    name: "",
  });
  const [timer, setTimer] = useState<number>(30);
  const [points, setPoints] = useState<number>(5);
  const [turn, setTurn] = useState<number>(0);
  const [userIndex, setUserIndex] = useState<number>(0);
  const [chooseQuestion, setChooseQuestion] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(
    questions ? questions.length - 1 : 4
  );
  const [disable, setDisabled] = useState(false);

  useEffect(() => {
    setUserIndex(membersState.indexOf(user.name));
  }, [membersState]);

  useEffect(() => {
    socket.emit("join-quiz-room", { roomId });
    const questionRef = ref(db, "quiz/rooms/" + roomId + "/questions");

    onValue(questionRef, (snapshot) => {
      setQuestions(snapshot.val());
    });

    const isLeader = user.leader === user.name;
    socket.emit(
      isLeader ? "quiz-client-ready-leader" : "quiz-client-ready",
      roomId,
      user.name
    );

    socket.on("get-members", (name: string) => {
      socket.emit("receive-members", roomId, membersRef.current, name);
    });

    socket.on("update-members", (members: string[], name: string) => {
      membersRef.current = [...members, name];
      setMembersState(membersRef.current);
    });

    socket.on("remove-member", (name: string) => {
      membersRef.current = membersRef.current.filter(
        (member) => member !== name
      );
      setMembersState(membersRef.current);
    });

    return () => {
      socket.off("get-state");
      socket.off("get-members");
      socket.off("update-members");
      socket.off("remove-member");
      socket.emit("quiz-exit", roomId, user.name);
    };
  }, []);

  if (!user.name) router.push("/quizzy/quiz");

  useEffect(() => {
    socket.on("startQuiz", () => {
      setChooseQuestion(true);
    });
  }, []);

  useEffect(() => {
    socket.on("quiz-finishGame", () => {
      set(ref(db, `quiz/rooms/${roomId}/points/${user.name}`), {
        points,
      });
      setFinishGame(true);
      setChooseQuestion(false);
      setStartGame(false);
    });
  }, [points]);

  useEffect(() => {
    socket.on("updateQuizCounter", ({ roomId, index }) => {
      setChosenQuestionIndex((prev) => [...prev, index]);
      setCounter(index);
      setChooseQuestion(false);
      setStartGame(true);
    });

    socket.on("updateQuizState", ({ roomId, index, correct, userName }) => {
      if (!questions) {
        return;
      }

      setAnswerBy({ index, name: userName });
      let bg = [...bgColors];

      if (correct) {
        bg[0] = "gray";
        bg[1] = "gray";
        bg[2] = "gray";
        bg[3] = "gray";
        bg[index] = "green";
      } else {
        bg[0] = "red";
        bg[1] = "red";
        bg[2] = "red";
        bg[3] = "red";
        bg[parseInt(questions[counter].correctAnswer)] = "green";
      }

      setBgColors(bg);

      setTurn((prev) => (prev === 0 ? 1 : 0));

      setTimeout(() => {
        setBgColors(["#ff996d", "#ffea00", "#bcffdd", "#0aefff"]);
        setAnswerBy({ index: 0, name: "" });
        setStartGame(false);
        setChooseQuestion(true);
      }, 1000);
    });
    socket.on("timeout", () => {
      if (!questions) {
        return;
      }
      setTurn((prev) => (prev === 0 ? 1 : 0));

      setTimeout(() => {
        setStartGame(false);
        setChooseQuestion(true);
        setTimer(30);
      }, 1000);
    });
  }, [questions]);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (startGame && questions) {
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
  }, [startGame, questions]);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (timer === 0) {
      setTurn((prev) => (prev === 0 ? 1 : 0));

      intervalId = setTimeout(() => {
        setStartGame(false);
        setChooseQuestion(true);
        setTimer(30);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);
  // useEffect(() => {
  //   console.log("Questions = ", questions);
  // }, [questions]);

  useEffect(() => {
    // console.log("chosenQuestionIndex", chosenQuestionIndex);
    if (
      questions &&
      chooseQuestion &&
      chosenQuestionIndex.length === questions.length * 3
    ) {
      socket.emit("quiz-finishGame", roomId);
    }
  }, [chosenQuestionIndex, chooseQuestion, questions, points]);

  const [finalPoints, setFinalPoint] = useState<{
    [id: string]: { points: string };
  }>({
    [membersState[0]]: { points: "0" },
    [membersState[1]]: { points: "0" },
  });

  useEffect(() => {
    if (finishGame) {
      onValue(ref(db, "/quiz/rooms/" + roomId + "/points"), (snapshot) => {
        const points: { [id: string]: { points: string } } = snapshot.val();
        setFinalPoint(
          Object.fromEntries(
            Object.entries(points).sort(
              (a, b) => parseInt(b[1].points) - parseInt(a[1].points)
            )
          )
        );
      });
    }
  }, [finishGame]);

  const [sliderWidth, setSliderWidth] = useState(0);
  useEffect(() => {
    setSliderWidth((timer / 30) * 100);
  }, [timer]);

  useEffect(() => {
    console.log("membersState[0]=> ", finalPoints[membersState[0]].points);
    console.log("membersState[1] => ", finalPoints[membersState[1]].points);
  }, [finalPoints]);

  /* =================== FILTERING QUESTIONS =================== */

  return (
    <div>
      <div>
        {(chooseQuestion || startGame) &&
        !finishGame &&
        membersState[turn] === user.name ? (
          <div className="fixed z-50 top-0 text-center left-0 flex items-center  text-white justify-center bg-blue-500 w-[100px] h-[35px] rounded-r-full">
            <h1 className="text-sm">Your Turn</h1>
          </div>
        ) : (
          <div className="fixed z-50 top-0 text-center left-0 flex items-center  text-white justify-center bg-red-500 w-[100px] h-[35px] rounded-r-full">
            <h1 className="text-sm">Other's Turn</h1>
          </div>
        )}
      </div>
      {membersState.length === 0 ? (
        <h1>LOADING</h1>
      ) : (
        <>
          {questions && chooseQuestion && (
            <div className="animate-fade-up animate-once fixed top-0 left-0 z-20 w-screen h-screen ">
              <div className="flex flex-col gap-20 w-full h-full justify-center items-center">
                <h1 className="text-white">CHOOSE QUESTION NUMBER</h1>
                <div className="w-[50%] items-center justify-center flex flex-wrap gap-x-5 gap-y-5 mx-auto text-white">
                  {questions.map((question, index) => (
                    <button
                      key={index + 1}
                      disabled={
                        userIndex !== turn ||
                        chosenQuestionIndex.includes(index)
                      }
                      onClick={() =>
                        socket.emit("updateQuizCounter", { roomId, index })
                      }
                      className="hover:text-black animate-wiggle animate-infinite border rounded-full disabled:bg-gray-200 flex justify-center items-center hover:bg-gray-200 cursor-pointer w-[50px] h-[50px] text-white border-white"
                    >
                      {index}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {startGame && questions ? (
            <div className="flex justify-center items-center flex-col h-screen">
              <div className="fixed top-0 left-0 bg-black z-50 w-screen h-1">
                <div
                  className="bg-white h-1 animate-pulse animate-infinite"
                  style={{ width: `${sliderWidth}%` }}
                ></div>
              </div>
              <div className="animate-ping animate-infinite animate-duration-1000  animate-delay-1000 animate-ease-linear animate-normal fixed top-7 right-7  bg-white w-[30px] h-[30px] rounded-full flex items-center justify-center">
                {timer}
              </div>
              <h2
                className="animate-fade-up animate-once text-3xl text-white tracking-wide animate-in"
                style={{
                  textShadow:
                    "1px 1px 30px #000, -1px 1px 10px #000, 1px 1px 10px #000",
                }}
              >
                {questions[counter].question}
              </h2>
              <div className="flex gap-20 mt-20 flex-wrap items-center justify-center">
                {questions[counter].options.map((opt, index) => (
                  <button
                    disabled={userIndex !== turn}
                    key={index}
                    onClick={() => {
                      if (
                        index === parseInt(questions[counter].correctAnswer)
                      ) {
                        setPoints((prev) => {
                          set(
                            ref(
                              db,
                              "quiz/rooms/" + roomId + "/points/" + user.name
                            ),
                            {
                              points: prev + 100,
                            }
                          );
                          return prev + 100;
                        });
                      }
                      socket.emit("updateQuizState", {
                        roomId,
                        index,
                        userName: user.name,
                        correct:
                          index === parseInt(questions[counter].correctAnswer),
                      });
                    }}
                    className="animate-fade-up disabled:bg-gray-100 text-black w-[300px] h-[60px] text-lg font-bold relative"
                    style={{ background: bgColors[index] }}
                  >
                    {opt}
                    {answerBy.name !== "" && answerBy.index === index && (
                      <p className="absolute right-2 bottom-2 text-sm z-10">
                        {answerBy.name}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            finishGame && (
              <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black/50 bg-blend-overlay">
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
                <div className="space-y-20 text-center mt-20 z-50">
                  <h1 className="text-white text-4xl font-bold">
                    {Object.entries(finalPoints)[0][0] === user.name
                      ? "You Win !"
                      : "You Loose !"}
                  </h1>
                  <div className="flex items-center justify-center flex-col gap-y-5">
                    {finalPoints &&
                      Object.keys(finalPoints).map((name, index) => {
                        return (
                          <TrophyCard
                            key={name}
                            type="quiz"
                            name={name}
                            count={(index + 1).toString()}
                            suffix={index === 0 ? "st" : "nd"}
                            score={(finalPoints[name].points + 10).toString()}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            )
          )}
          {!startGame && !finishGame && !chooseQuestion && (
            <main className="flex justify-start items-center flex-col gap-y-5">
              <Image
                src="/picture/quiz-logo.png"
                width={200}
                height={200}
                alt="user avatar"
              />
              <RoomMembers members={membersState} />
              <Button
                className="w-full animate-pulse"
                onClick={() => socket.emit("startQuiz", roomId)}
                disabled={user.leader !== user.name}
              >
                Start Game
              </Button>{" "}
              <h1 className="py-2 w-full text-center text-xl bg-white/80 rounded-lg ">
                Room ID : {roomId}
              </h1>
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default Room;
