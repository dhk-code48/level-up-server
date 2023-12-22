"use client";

import { useContext, useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/ContextProvider";
import getQuestion from "@/lib/generateRandomQuestions";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/firebase/config";
import generateRandomQuestions from "@/lib/generateRandomQuestions";
import Image from "next/image";

export default function Home() {
  const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4);
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [nameError, setNameError] = useState(false);
  const [joinIdError, setJoinIdError] = useState(false);
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>("https://api.multiavatar.com/DarshanDhakal.png");

  // INITIAL QUESTIONS ----------
  const [initialQuestions, setInitialQuestions] = useState<Subject[] | null>(null);
  const [subject, setSubject] = useState<string>("Course");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [noOfQuestions, setNoOfQuestions] = useState<number>(25);

  useEffect(() => {
    const questionRef = ref(db, "questions/" + subject);
    onValue(questionRef, (snapshot) => {
      setInitialQuestions(snapshot.val());
    });
  }, []);

  function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {
    // console.log("chapter", quizData);

    if (initialQuestions) {
      console.log("initialQuestions ==> ", noOfQuestions);
      const noOfSubjects = initialQuestions.length; // 5
      const noOfChapters = 5;
      const noOfQuestionsFromEachSubject = noOfQuestions / noOfSubjects; // 4
      const noOfQuestionFromEachChapter = noOfQuestionsFromEachSubject / noOfChapters;
      console.log("noOfQuestionFromEachChapter ===> ", noOfQuestionFromEachChapter);
      initialQuestions.map((quiz) => {
        Object.keys(quiz.chapters).map((cN) => {
          //     // console.log("Chopter Name", cN);
          let questionArray = quiz.chapters[cN].questions;
          let newArray: Question[] = [];
          for (let j = 0; j < noOfQuestionFromEachChapter; j++) {
            const ques: number = getRndInteger(0, questionArray.length);
            newArray.push({ ...questionArray[ques] });
            questionArray.splice(ques, 1);
          }
          setQuestions((prev) => [...prev, ...newArray]);
        });
      });
    }
  }, [initialQuestions]);

  useEffect(() => {
    // if (name.length > 3) {
    //   setAvatar("https://api.multiavatar.com/" + name + ".png?apikey=dHPlXfrUZEcvuO");
    // }
  }, [name]);

  useEffect(() => {
    console.log("QUESTION => ,", questions);
  }, [questions]);

  const handleCreateRoom = () => {
    if (!name) return setNameError(true);
    setNameError(false);
    const roomId = nanoid();
    const questionRef = ref(db, "questions");

    set(ref(db, "quiz/rooms/" + roomId), {
      questions: questions,
    });

    setUser({ name, roomId, members: [], leader: name });
    router.push(`/quizzy/quiz/room/${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!name) return setNameError(true);
    setNameError(false);
    if (!joinId || joinId.length > 4) return setJoinIdError(true);
    setJoinIdError(false);
    setUser({ name, roomId: joinId, members: [], leader: "" });
    router.push(`/quizzy/quiz/room/${joinId}`);
  };

  return (
    <main className="background min-h-screen py-10 h-screen w-full">
      <div className="flex flex-col  items-center justify-stretch p-6 mx-auto rounded-lg borer-2 glass md:p-10 gap-y-6 w-max ">
        {/*   Title    */}
        <Image src={avatar} width={100} height={100} alt="user avatar" />

        <input
          type="text"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 text-lg border-2 border-black rounded-md w-full md:w-80 outline-0 btn-shadow"
        />

        {nameError && <p className="text-red-600">Enter Name</p>}
        <input
          type="text"
          placeholder="Room ID"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value.toUpperCase())}
          className="p-2 w-full text-lg border-2 border-black rounded-md md:w-80 outline-0 btn-shadow"
        />
        {joinIdError && <p className="text-red-600">Enter Valid Room ID </p>}

        <input
          disabled={user.leader !== user.name}
          type="text"
          value={noOfQuestions}
          onChange={(e) => setNoOfQuestions(parseInt(e.target.value))}
          placeholder="NO OF QUESTION"
          className="p-2 w-full text-lg text-black border-2 border-black rounded-md outline-0 btn-shadow"
        />
        <Select defaultValue="Course" disabled={user.leader !== user.name}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Subjects</SelectLabel>
              <SelectItem defaultChecked value="Course">
                Course
              </SelectItem>
              <SelectItem value="General">General Knowlede</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <button
          onClick={handleJoinRoom}
          className="block w-full pb-0 p-2 mx-auto text-2xl font-semibold text-center text-white transition-all bg-blue-500 rounded-md md:text-3xl btn-shadow hover:scale-105 active:scale-90"
        >
          Join Room
        </button>
        <button
          onClick={handleCreateRoom}
          className="block w-full pb-0 p-2 mx-auto text-2xl font-semibold text-center text-white transition-all rounded-md bg-emerald-500 md:text-3xl btn-shadow hover:scale-105 active:scale-90"
        >
          Create Room
        </button>
      </div>
    </main>
  );
}
