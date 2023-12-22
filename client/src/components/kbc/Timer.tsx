"use client";
import { KBCContext } from "@/context/KBCContext";
import React, { FC, useContext, useEffect, useState } from "react";

const Timer: FC = () => {
  const { kbc } = useContext(KBCContext);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (kbc.timer) {
      setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
  }, [kbc.timer]);

  useEffect(() => {
    if (timer === 0) {
      setTimer(60);
      kbc.setFinishGame(true);
    }
  }, [timer]);

  useEffect(() => {
    setTimer(60);
  }, [kbc.questionCounter]);

  return (
    <div className="h-12 lg:w-20 w-12 p-5 lg:p-0 lg:pb-1 timer cursor-pointer mb-0 font-bold text-lg  flex items-center lg:items-end justify-center rounded-b-full lg:rounded-b-none rounded-t-full ">
      <div>{timer}</div>
    </div>
  );
};

export default Timer;
