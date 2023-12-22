"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";

const Landing = () => {
  const [userName, setUserName] = useState("");
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="space-y-5 w-[300px]">
        <Input
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          placeholder="Enter Your Name"
        />
        <Link
          href={"/quizzy/kbc/" + userName}
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          Start Game
        </Link>
      </div>
    </div>
  );
};

export default Landing;
