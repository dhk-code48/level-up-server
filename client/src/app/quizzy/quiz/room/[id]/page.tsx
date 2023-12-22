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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-paint-io.onrender.com"
    : "http://localhost:3001";

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
  const [bgColors, setBgColors] = useState<string[]>(["#ff996d", "#ffea00", "#bcffdd", "#0aefff"]);
  const [answerBy, setAnswerBy] = useState<{ index: number; name: string }>({ index: 0, name: "" });
  const [timer, setTimer] = useState<number>(30);
  const [points, setPoints] = useState<number>(5);
  const [turn, setTurn] = useState<number>(0);
  const [userIndex, setUserIndex] = useState<number>(0);
  const [chooseQuestion, setChooseQuestion] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(questions ? questions.length - 1 : 4);

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
    socket.emit(isLeader ? "quiz-client-ready-leader" : "quiz-client-ready", roomId, user.name);

    socket.on("get-members", (name: string) => {
      socket.emit("receive-members", roomId, membersRef.current, name);
    });

    socket.on("update-members", (members: string[], name: string) => {
      membersRef.current = [...members, name];
      setMembersState(membersRef.current);
    });

    socket.on("remove-member", (name: string) => {
      membersRef.current = membersRef.current.filter((member) => member !== name);
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
      console.log("GAME FINISHED");
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
        console.log("NO QUESTIONS");
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
        bg[parseInt(questions[counter].correct)] = "green";
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
  }, [questions]);

  useEffect(() => {
    console.log("Questions = ", questions);
  }, [questions]);

  useEffect(() => {
    console.log("chosenQuestionIndex", chosenQuestionIndex);
    if (questions && chooseQuestion && chosenQuestionIndex.length === questions.length * 3) {
      socket.emit("quiz-finishGame", roomId);
    }
  }, [chosenQuestionIndex, chooseQuestion, questions, points]);

  /* =================== FILTERING QUESTIONS =================== */

  return (
    <div className="background-2">
      <div>
        {(chooseQuestion || startGame) && membersState[turn] === user.name ? (
          <div className="fixed z-50 top-0 left-[50%] right-[50%] flex items-start pt-1 text-white justify-center bg-[#0c2c96bf] w-[120px] h-[60px] rounded-b-full">
            <h1>Your Turn</h1>
          </div>
        ) : (
          <div className="fixed z-50 top-0 text-center left-[50%] right-[50%] flex items-start pt-1 text-white justify-center bg-red-500 w-[200px] h-[70px] rounded-b-full">
            <h1>
              {user.name}
              <br /> Turn's
            </h1>
          </div>
        )}
      </div>
      {membersState.length === 0 ? (
        <h1>LOADING</h1>
      ) : (
        <>
          {finishGame && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-white">
              <h1>GAME FINISHED</h1>
            </div>
          )}
          {questions && chooseQuestion && (
            <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-white">
              <div className="flex flex-col gap-20 w-full h-full justify-center items-center">
                <h1>CHOOSE QUESTION NUMBER</h1>
                <div className="w-[50%] flex flex-wrap gap-x-5 gap-y-5 mx-auto">
                  {questions.map((question, index) => (
                    <button
                      key={index + 1}
                      disabled={userIndex !== turn || chosenQuestionIndex.includes(index)}
                      onClick={() => socket.emit("updateQuizCounter", { roomId, index })}
                      className="border rounded-full disabled:bg-gray-200 flex justify-center items-center hover:bg-gray-200 cursor-pointer w-[50px] h-[50px]"
                    >
                      {index}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {startGame && questions && (
            <div className="flex justify-center items-center flex-col h-screen">
              <div className="fixed top-5 left-[50%] right-[50%]">{timer}</div>
              <h2
                className="text-3xl text-white tracking-wide"
                style={{
                  textShadow: "1px 1px 30px #000, -1px 1px 10px #000, 1px 1px 10px #000",
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
                      if (index === parseInt(questions[counter].correct)) {
                        setPoints((prev) => prev + 5);
                      }
                      socket.emit("updateQuizState", {
                        roomId,
                        index,
                        userName: user.name,
                        correct: index === parseInt(questions[counter].correct),
                      });
                    }}
                    className="disabled:bg-gray-100 text-black w-[300px] h-[60px] text-lg font-bold relative"
                    style={{ background: bgColors[index] }}
                  >
                    {opt.label}
                    {answerBy.name !== "" && answerBy.index === index && (
                      <p className="absolute right-2 bottom-2 text-sm z-10">{answerBy.name}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!startGame && (
            <main className="flex justify-start items-center flex-col">
              {/*   Title    */}
              <Image
                src="/picture/quiz-logo.png"
                className="h-[200px] lg:w-auto"
                alt="RAPIDFIRE LOGO"
                width={499}
                height={499}
              />
              <h1 className="p-2 mx-auto fixed bottom-10 pb-0 text-2xl font-bold text-center text-white bg-black rounded-md md:text-4xl w-max">
                Room ID : {roomId}
              </h1>
              <div className="bg-[#0c2c96bf] my-10 w-[90%] lg:w-auto items-center justify-center p-5 rounded-lg">
                <RoomMembers members={membersState} />
              </div>

              <button
                className="block w-auto pb-0 p-2 mx-auto text-2xl font-semibold text-center text-white transition-all rounded-md bg-emerald-500 md:text-3xl btn-shadow hover:scale-105 active:scale-90"
                onClick={() => socket.emit("startQuiz", roomId)}
                disabled={user.leader !== user.name}
              >
                Start Game
              </button>
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default Room;
