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

export default function Home() {
  const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4);
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [nameError, setNameError] = useState(false);
  const [joinIdError, setJoinIdError] = useState(false);
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>("https://api.multiavatar.com/DarshanDhakal.png");

  useEffect(() => {
    // if (name.length > 3) {
    //   setAvatar("https://api.multiavatar.com/" + name + ".png?apikey=dHPlXfrUZEcvuO");
    // }
  }, [name]);
  useEffect(() => {
    console.log(avatar);
  }, [avatar]);

  const [questions, setQuestions] = useState<question[] | null>([]);

  useEffect(() => {
    console.log("QUESTION => ,", questions);
  }, [questions]);

  const handleCreateRoom = () => {
    if (!name) return setNameError(true);
    setNameError(false);
    const roomId = nanoid();
    const questionRef = ref(db, "questions");

    onValue(questionRef, (snapshot) => {
      const data: question[] = snapshot.val();
      setQuestions(generateRandomQuestions(data, 5));

      set(ref(db, "rapidfire/rooms/" + roomId), {
        questions: generateRandomQuestions(data, 5),
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
    <main className="background min-h-screen py-10 h-screen w-full">
      <div className="flex flex-col  items-center justify-stretch p-6 mx-auto rounded-lg borer-2 glass md:p-10 gap-y-6 w-max ">
        {/* <Image
          src="/picture/rapidfire_transparent.png"
          className="w-[300px] lg:w-auto"
          alt="RAPIDFIRE LOGO"
          width={582}
          height={332}
        /> */}

        <Image src={avatar} width={100} height={100} alt="user avatar" />
        <input
          type="text"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 w-full text-lg border-2 text-black border-black rounded-md outline-0 btn-shadow"
        />
        {nameError && <p className="text-red-600">Enter Name</p>}
        <input
          type="text"
          placeholder="Room ID"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value.toUpperCase())}
          className="p-2 w-full text-lg text-black border-2 border-black rounded-md outline-0 btn-shadow"
        />
        {joinIdError && <p className="text-red-600">Enter Valid Room ID </p>}

        <button
          onClick={handleJoinRoom}
          className="block w-full p-2 mx-auto text-2xl font-semibold text-center text-white transition-all bg-blue-500 rounded-md md:text-3xl btn-shadow hover:scale-105 active:scale-90"
        >
          Join Room
        </button>
        <button
          onClick={handleCreateRoom}
          className="block w-full p-2 mx-auto text-2xl font-semibold text-center text-white transition-all rounded-md bg-emerald-500 md:text-3xl btn-shadow hover:scale-105 active:scale-90"
        >
          Create Room
        </button>
      </div>
    </main>
  );
}
