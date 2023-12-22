import { onValue, ref } from "firebase/database";
import shuffle from "lodash/shuffle";
import { db } from "./config";
import { Unsubscribe } from "firebase/app-check";

export interface KBCQuestions {
  level: "easy" | "moderate" | "hard" | "extreme";
  question: string;
  options: string[];
  correctAnswer: number;
}

const getKBCQuestions = (): Unsubscribe | null => {
  try {
    const questionsRef = ref(db, "kbc/questions");
    let questions: KBCQuestions[] = [];
    return onValue(questionsRef, (snapshot) => {
      const data: KBCQuestions[] = snapshot.val();
      const easyQuestions: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "easy")
      ).slice(0, 4);
      const moderateQuestion: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "moderate")
      ).slice(0, 4);
      const hardQuestions: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "hard")
      ).slice(0, 4);
      const extremeQuestions: KBCQuestions[] = shuffle(
        data.filter(({ level }) => level === "extreme")
      ).slice(0, 4);
      return [...easyQuestions, ...moderateQuestion, ...hardQuestions, ...extremeQuestions];
    });
  } catch {
    return null;
  }
};

export default getKBCQuestions;
