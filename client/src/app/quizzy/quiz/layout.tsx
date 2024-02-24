import { SparkingBackground } from "@/components/sparking-bg";
import React from "react";

const QuizLayout = ({ children }: { children: React.ReactNode }) => {
  return <SparkingBackground>{children}</SparkingBackground>;
};

export default QuizLayout;
