type Option = {
  img: string;
  label: string;
};

type Question = {
  avgTime: number;
  chapter: string;
  correctAnswer: string;
  level: string;
  options: string[];
  points: string;
  question: string;
  questionImg: string;
};

type Chapter = {
  chapterName: string;
  numberOfQuestions: number;
  questions: Question[];
};

type Subject = {
  subjectName: string;
  noOfChapters: number;
  noOfQuestion: number;
  chapters: Record<string, Chapter>;
};

type Course = {
  General: Subject[];
};

type Data = {
  questions: Course;
};

interface Points {
  x: number;
  y: number;
}

interface ColorCicleProps {
  style: "small" | "mid" | "large";
  size: SizeProps[size];
  setSize: (size: SizeProps[size]) => void;
}

interface SizeProps {
  size: 5 | 7.5 | 10;
}

interface RoomProps {
  id: string;
}

interface pointsProps {
  [key: string]: {
    points: number;
  };
}

interface question {
  avgTime: number;
  chapter: string;
  correctAnswer: string;
  level: string;
  options: string[];
  points: string;
  question: string;
  questionImg: string;
}

interface UserProps {
  name: string;
  roomId: string;
  leader: string;
  members: string[];
}

type CallBack = (e: UserProps) => UserProps;
interface UserContext {
  user: UserProps;
  setUser: ((user: UserProps) => void) & ((e: CallBack) => void);
}
