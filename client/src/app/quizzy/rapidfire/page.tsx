"use client";

import { useContext, useEffect, useState } from "react";
import { customAlphabet } from "nanoid";

import { useRouter } from "next/navigation";
import { UserContext } from "@/context/ContextProvider";
import getQuestion from "@/lib/generateRandomQuestions";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/firebase/config";
import generateRandomQuestions from "@/lib/generateRandomQuestions";
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
import { shuffle } from "lodash";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    // if (name.length > 3) {
    //   setAvatar("https://api.multiavatar.com/" + name + ".png?apikey=dHPlXfrUZEcvuO");
    // }
  }, [name]);
  useEffect(() => {
    console.log(avatar);
  }, [avatar]);

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

      const totalQuestion = [
        ...moderateQuestions,
        ...hardQuestions,
        ...extremeQuestions,
        ...extremeHardQuestions,
      ];

      set(ref(db, "rapidfire/rooms/" + roomId), {
        questions: shuffle(totalQuestion),
      });
    });

    setUser({ name, roomId, members: [], leader: name });
    router.push(`/quizzy/rapidfire/room/${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!name) return setNameError(true);
    setNameError(false);
    if (!joinId || joinId.length > 4) return setJoinIdError(true);
    setJoinIdError(false);
    setUser({ name, roomId: joinId, members: [], leader: "" });
    router.push(`/quizzy/rapidfire/room/${joinId}`);
  };

  return (
    <main className="w-[300px] subjective">
      <div className="flex flex-col  items-center gap-y-5">
        <Image
          src={avatar}
          width={100}
          height={100}
          alt="user avatar"
          className="animate-fade-up"
        />
        <input
          type="text"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 pb-1 animate-fade-up w-full text-lg border-2 text-black border-black rounded-md outline-0 btn-shadow"
        />
        {nameError && <p className="text-red-600">Enter Name</p>}
        <input
          type="text"
          placeholder="Room ID"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value.toUpperCase())}
          className="p-2 pb-1 animate-fade-up w-full text-lg border-2 text-black border-black rounded-md outline-0 btn-shadow"
        />
        {joinIdError && <p className="text-red-600">Enter Valid Room ID </p>}
        <Select
          onValueChange={(value) => setNoOfQuestions(parseInt(value))}
          defaultValue={noOfQuestions.toString()}
        >
          <SelectTrigger className="p-2 pb-1 animate-fade-up w-full text-lg border-2 text-black border-black rounded-md outline-0 btn-shadow">
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
        <Button
          className="animate-pulse animate-infinite bg-green-500 w-full"
          onClick={handleJoinRoom}
        >
          Join Room
        </Button>
        <Button
          className="animate-fade animate-once w-full"
          onClick={handleCreateRoom}
        >
          Create Room
        </Button>
      </div>
    </main>
  );
}
