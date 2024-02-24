import { SparkingBackground } from "@/components/sparking-bg";
import React from "react";

const RapidFireLayout = ({ children }: { children: React.ReactNode }) => {
  return <SparkingBackground>{children}</SparkingBackground>;
};

export default RapidFireLayout;
