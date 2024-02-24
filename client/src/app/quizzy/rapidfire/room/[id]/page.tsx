"use client";
import "@/styles/rain.css";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import RoomMembers from "@/components/rapidfire/RoomMembers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/context/ContextProvider";
import { Button } from "@/components/ui/button";
import Game from "@/components/rapidfire/Game";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/firebase/config";
import Image from "next/image";
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
  const { setUser, user } = useContext(UserContext);
  const roomId = params.id;
  const [color, setColor] = useState("#000");
  const [size, setSize] = useState<5 | 7.5 | 10>(5);
  const [membersState, setMembersState] = useState<string[]>([]);
  const membersRef = useRef<string[]>([]);
  const router = useRouter();
  const [startGame, setStartGame] = useState<boolean>(false);
  const [finishGame, setFinishGame] = useState<boolean>(false);
  const [questions, setQuestions] = useState<question[] | null>(null);
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
  const [points, setPoints] = useState<number>(10);
  const [finalPoints, setFinalPoints] = useState<{
    [id: string]: { points: string };
  }>({
    [membersState[0]]: { points: "0" },
    [membersState[1]]: { points: "0" },
  });
  useEffect(() => {
    if (finishGame) {
      onValue(ref(db, "/rapidfire/rooms/" + roomId + "/points"), (snapshot) => {
        const points: { [id: string]: { points: string } } = snapshot.val();
        setFinalPoints(
          Object.fromEntries(
            Object.entries(points).sort(
              (a, b) => parseInt(b[1].points) - parseInt(a[1].points)
            )
          )
        );
      });
    }
  }, [finishGame]);
  // useEffect(() => {
  //   let point = 0;
  //   Object.keys(finalPoints).forEach((name) => {
  //     point = finalPoints[name].points;
  //     if (finalPoints[name].points > point) {
  //       point = finalPoints[name].points;
  //     }
  //   });
  //   setWhoIsFirst(point);
  // }, [finalPoints]);

  useEffect(() => {
    socket.emit("join-room", { roomId });

    const questionRef = ref(db, "rapidfire/rooms/" + roomId + "/questions");

    onValue(questionRef, (snapshot) => {
      setQuestions(snapshot.val());
    });

    if (user.leader === user.name) {
      socket.emit("client-ready-leader", roomId, user.name);
    } else {
      socket.emit("client-ready", roomId, user.name);
    }

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
      socket.off("canvas-state-from-server");
      socket.off("get-members");
      socket.off("update-members");
      socket.off("remove-member");

      socket.emit("exit", roomId, user.name);
    };
  }, []);

  if (!user.name) router.push("/quizzy/rapidfire");

  useEffect(() => {
    socket.on("startgame", () => {
      console.log("GAME STARTED");
      setStartGame(true);
    });
  }, []);
  useEffect(() => {
    socket.on("finishgame", () => {
      console.log("GAME FINISHED");
      setFinishGame(true);
    });
  }, []);

  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    socket.on("updateCounter", ({ roomId, index, userName, correct }) => {
      if (!questions) {
        console.log("NO QUESTIONS");
        return;
      }

      setAnswerBy({ index, name: userName });

      let bg = [...bgColors];

      if (correct) {
        let bg = [...bgColors];
        bg[0] = "gray";
        bg[1] = "gray";
        bg[2] = "gray";
        bg[3] = "gray";
        bg[index] = "green";
        setBgColors(bg);
      } else {
        bg[0] = "red";
        bg[1] = "red";
        bg[2] = "red";
        bg[3] = "red";
        bg[parseInt(questions[counter].correctAnswer)] = "green";
        setBgColors(bg);
      }

      setTimeout(() => {
        setCounter((prev) => {
          if (prev + 1 === questions.length) {
            socket.emit("finishgame", roomId);
            return 0;
          } else {
            return prev + 1;
          }
        });
      }, 1000);

      setTimeout(() => {
        setBgColors(["#ff996d", "#ffea00", "#bcffdd", "#0aefff"]);
        setAnswerBy({ index: 0, name: "" });
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
    if (timer === 0 && questions) {
      socket.emit("updateCounter", {
        roomId,
        index: parseInt(questions[counter].correctAnswer),
        userName: "",
        correct: true,
      });
    }
  }, [timer, questions]);
  useEffect(() => {
    console.log("membersState[0]=> ", finalPoints[membersState[0]].points);
    console.log("membersState[1] => ", finalPoints[membersState[1]].points);
  }, [finalPoints]);
  // useEffect(() => {
  //   if (timer <= 0) {
  //     setTimeout(() => {
  //       setTimer(0);
  //       socket.emit("updateCounter", {
  //         roomId: roomId,
  //         index: 0,
  //         userName: "",
  //         correct: true,
  //       });
  //     }, 500);
  //   }
  // }, [timer]);

  useEffect(() => {
    console.log("counter", counter);
  }, [counter]);
  const [sliderWidth, setSliderWidth] = useState(0);
  useEffect(() => {
    setSliderWidth((timer / 30) * 100);
  }, [timer]);

  return (
    <div>
      {membersState.length === 0 ? (
        <h1>LOADING</h1>
      ) : (
        <>
          {finishGame && (
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
          )}
          {!finishGame && startGame ? (
            <>
              {questions && (
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
                        key={opt}
                        onClick={() => {
                          if (
                            index === parseInt(questions[counter].correctAnswer)
                          ) {
                            setPoints((prev) => {
                              set(
                                ref(
                                  db,
                                  "rapidfire/rooms/" +
                                    roomId +
                                    "/points/" +
                                    user.name
                                ),
                                {
                                  points: prev + 100,
                                }
                              );
                              return prev + 100;
                            });
                          } else {
                            setPoints((prev) => {
                              set(
                                ref(
                                  db,
                                  "rapidfire/rooms/" +
                                    roomId +
                                    "/points/" +
                                    user.name
                                ),
                                {
                                  points: prev - 50 < 0 ? prev : prev - 50,
                                }
                              );
                              return prev - 50 < 0 ? prev : prev - 50;
                            });
                          }
                          socket.emit("updateCounter", {
                            roomId: roomId,
                            index: index,
                            userName: user.name,
                            correct:
                              index ===
                              parseInt(questions[counter].correctAnswer),
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
              )}{" "}
            </>
          ) : (
            !finishGame && (
              <main className="flex justify-start items-center flex-col">
                {/*   Title    */}
                <Image
                  src="/picture/rapidfire_transparent.png"
                  className="w-[200px] lg:w-auto"
                  alt="RAPIDFIRE LOGO"
                  width={582}
                  height={332}
                />

                <RoomMembers members={membersState} />

                <h1 className="p-2 fixed bottom-10 pb-0 text-2xl font-bold text-center text-white bg-black rounded-md md:text-4xl w-max">
                  Room ID : {roomId}
                </h1>

                <button
                  onClick={() => socket.emit("startgame", roomId)}
                  disabled={
                    user.leader !== user.name || membersState.length === 1
                  }
                  className="mt-5 block w-auto p-2 pb-0 mx-auto text-2xl font-semibold text-center text-white transition-all rounded-md bg-emerald-500 md:text-3xl btn-shadow hover:scale-105 active:scale-90"
                >
                  START GAME
                </button>
              </main>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Room;
