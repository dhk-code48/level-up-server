"use client";
import React, { FC, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "../ui/button";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-paint-io.onrender.com"
    : "http://localhost:3001";

const socket = io(serverUrl);

const Game: FC<{ questions: question[] | null; roomId: string }> = ({ questions, roomId }) => {
  const [counter, setCounter] = useState<number>(questions ? questions.length - 1 : 4);

  useEffect(() => {
    console.log("ROOM ID => ", roomId);
  }, [roomId]);

  useEffect(() => {
    socket.on("updateCounter", () => {
      console.log("COUNTER UPDATED");
      setCounter((prev) => prev - 1);
    });
  }, []);

  useEffect(() => {
    console.log("counter", counter);
  }, [counter]);

  const [bgColors, setBgColors] = useState<string[]>(["#ff996d", "#ffea00", "#bcffdd", "#0aefff"]);

  function handleAnswer(index: number) {
    if (!questions) {
      return;
    }
    console.log("CLICKED", index);

    if (index === questions[counter].correct) {
      let bg = [...bgColors];
      bg[index] = "green";
      setBgColors(bg);
    } else {
      let bg = [...bgColors];
      bg[0] = "red";
      bg[1] = "red";
      bg[2] = "red";
      bg[3] = "red";
      bg[questions[counter].correct] = "green";
      setBgColors(bg);
    }
  }

  return (
    <div>
      {questions && (
        <div className="flex justify-center items-center flex-col h-screen">
          <h2
            className="text-3xl text-white tracking-wide "
            style={{ textShadow: "1px 1px 30px #000, -1px 1px 10px #000, 1px 1px 10px #000" }}
          >
            {questions[counter].question}
          </h2>
          <div className="flex gap-20 mt-20 flex-wrap items-center justify-center">
            {questions[counter].options.map((opt, index: number) => (
              <button
                key={index + 1}
                onClick={() => socket.emit("updateCounter", roomId)}
                className="text-black w-[300px] h-[60px] text-lg font-bold relative"
                style={{ background: bgColors[index] }}
              >
                {opt}
                <p className="absolute right-2 bottom-2 text-sm z-10">{}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
