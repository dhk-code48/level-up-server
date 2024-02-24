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
import { shuffle } from "lodash";
import Image from "next/image";
import { SparkingBackground } from "@/components/sparking-bg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4);
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [nameError, setNameError] = useState(false);
  const [joinIdError, setJoinIdError] = useState(false);
  const router = useRouter();

  const [avatar, setAvatar] = useState<string>(
    "https://api.multiavatar.com/DarshanDhakal.png"
  );

  const [noOfQuestions, setNoOfQuestions] = useState<number>(20);

  const handleCreateRoom = () => {
    if (!name) return setNameError(true);
    setNameError(false);
    const roomId = nanoid();
    const questionsRef = ref(db, "questions");
    const noOfQuestionFromEachLevel = noOfQuestions / 4;
    onValue(questionsRef, (snapshot) => {
      const data: Question[] = snapshot.val();
      const moderateQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "moderate")
      ).slice(0, noOfQuestionFromEachLevel);
      const hardQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "hard")
      ).slice(0, noOfQuestionFromEachLevel);
      const extremeQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "extreme")
      ).slice(0, noOfQuestionFromEachLevel);
      const extremeHardQuestions: Question[] = shuffle(
        data.filter(({ level }) => level === "extremeHard")
      ).slice(0, noOfQuestionFromEachLevel);

      console.log(
        moderateQuestions,
        hardQuestions,
        extremeQuestions,
        extremeHardQuestions
      );

      const totalQuestion = [
        ...moderateQuestions,
        ...hardQuestions,
        ...extremeQuestions,
        ...extremeHardQuestions,
      ];

      set(ref(db, "quiz/rooms/" + roomId), {
        questions: shuffle(totalQuestion),
      });
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
    <main className="w-[300px]">
      <div className="flex flex-col  items-center gap-y-5">
        <Image
          className="animate-fade-up"
          src={avatar}
          width={100}
          height={100}
          alt="user avatar"
        />
        <Input
          type="text"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {nameError && <p className="text-red-600">Enter Name</p>}
        <Input
          type="text"
          placeholder="Room ID"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value.toUpperCase())}
        />
        {joinIdError && <p className="text-red-600">Enter Valid Room ID </p>}

        <Select
          onValueChange={(value) => setNoOfQuestions(parseInt(value))}
          defaultValue={noOfQuestions.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>
          <SelectGroup>
            <SelectContent>
              <SelectLabel>Number Of Questions</SelectLabel>

              <SelectItem value="8">8</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="24">28</SelectItem>
              <SelectItem value="34">32</SelectItem>
            </SelectContent>
          </SelectGroup>
        </Select>

        <Button className="w-full" onClick={handleJoinRoom}>
          Join Room
        </Button>
        <Button className="w-full" onClick={handleCreateRoom}>
          Create Room
        </Button>
      </div>
    </main>
  );
}
