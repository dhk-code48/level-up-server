"use client";
import React, { FC, createContext, useState, Dispatch, SetStateAction, useEffect } from "react";

export interface KBCQuestions {
  level: "easy" | "moderate" | "hard" | "extreme";
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ContextProps {
  kbc: {
    finishGame: boolean;
    setFinishGame: Dispatch<SetStateAction<boolean>>;

    pauseGame: boolean;
    setPauseGame: Dispatch<SetStateAction<boolean>>;
    timer: boolean;
    setTimer: Dispatch<SetStateAction<boolean>>;
    questions: KBCQuestions[];
    lifelines: {
      askHost: boolean;
      setAskHost: Dispatch<SetStateAction<boolean>>;
      fiftyfifty: boolean;
      setFiftyFifty: Dispatch<SetStateAction<boolean>>;
    };
    setQuestions: Dispatch<SetStateAction<KBCQuestions[]>>;
    questionCounter: number;
    steQuestionCounter: Dispatch<SetStateAction<number>>;

    disableAllOption: boolean;
    setDisableAllOption: Dispatch<SetStateAction<boolean>>;
  };
}

const KBCContext = createContext<ContextProps>({
  kbc: {
    finishGame: false,
    setFinishGame: (() => {}) as Dispatch<SetStateAction<boolean>>,

    disableAllOption: false,
    setDisableAllOption: (() => {}) as Dispatch<SetStateAction<boolean>>,
    pauseGame: false,
    setPauseGame: (() => {}) as Dispatch<SetStateAction<boolean>>,
    timer: false,
    setTimer: (() => {}) as Dispatch<SetStateAction<boolean>>,
    questions: [],
    questionCounter: 0,
    lifelines: {
      askHost: true,
      setAskHost: (() => {}) as Dispatch<SetStateAction<boolean>>,
      fiftyfifty: true,
      setFiftyFifty: (() => {}) as Dispatch<SetStateAction<boolean>>,
    },
    setQuestions: (() => {}) as Dispatch<SetStateAction<KBCQuestions[]>>,
    steQuestionCounter: (() => {}) as Dispatch<SetStateAction<number>>,
  },
});

const KBCContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timer, setTimer] = useState<boolean>(false);
  const [askHost, setAskHost] = useState<boolean>(true);
  const [fiftyfifty, setFiftyFifty] = useState<boolean>(true);
  const [questions, setQuestions] = useState<KBCQuestions[]>([]);
  const [questionCounter, steQuestionCounter] = useState<number>(0);
  const [finishGame, setFinishGame] = useState<boolean>(false);
  const [disableAllOption, setDisableAllOption] = useState<boolean>(false);
  const [pauseGame, setPauseGame] = useState<boolean>(false);

  useEffect(() => {
    if (questionCounter === 16) {
      console.log("Game Finished BY Question Counter = > ");
      setFinishGame(true);
    }
  }, [questionCounter]);

  return (
    <KBCContext.Provider
      value={{
        kbc: {
          pauseGame,
          setPauseGame,
          timer,
          setTimer,
          lifelines: { askHost, setAskHost, fiftyfifty, setFiftyFifty },
          questions,
          setQuestions,
          questionCounter,
          steQuestionCounter,
          finishGame,
          setFinishGame,
          disableAllOption,
          setDisableAllOption,
        },
      }}
    >
      {children}
    </KBCContext.Provider>
  );
};

export { KBCContext, KBCContextProvider };
