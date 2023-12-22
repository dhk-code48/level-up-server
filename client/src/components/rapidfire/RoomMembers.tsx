import Image from "next/image";
import React from "react";

const RoomMembers = ({ members }: { members: string[] }) => {
  return (
    <div className="flex flex-col p-3 px-8 rounded-md gap-y-2">
      <h1 className="text-3xl font-semibold capitalize mb-5 text-center text-white">Members</h1>
      <div className="text-2xl space-y-10">
        {members.map((member, i) => (
          <div className="flex gap-x-5 items-center justify-start text-white">
            <Image
              src={"https://api.multiavatar.com/" + member + ".png?apikey=dHPlXfrUZEcvuO"}
              width={100}
              height={100}
              alt="user avatar"
            />
            <h1 key={i} className="">
              {member}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomMembers;
