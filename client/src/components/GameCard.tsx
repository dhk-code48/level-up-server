"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Link from "next/link";

export function GameCard({
  name,
  picture,
  link,
}: {
  name: string;
  picture: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <CardContainer className="inter-var cursor-pointer animate-fade animate-once">
        <CardBody className="bg-background relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[400px] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-200 dark:text-white"
          >
            {name}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            Quizzy Mods
          </CardItem>
          <CardItem translateZ="100" translateX={-30} className="w-full mt-4">
            <Image
              src={picture}
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
        </CardBody>
      </CardContainer>
    </Link>
  );
}
