import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3001;

interface OnDrawSocketProps {
  currentPoints: Points;
  prePoints: Points | null;
  color: string;
  size: 5 | 7.5 | 10;
  roomId: string;
}

interface Points {
  x: number;
  y: number;
}

io.on("connection", (socket) => {
  // ########## RAPID - FIRE ROUNDS ########## //
  socket.on("join-room", ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
  });

  socket.on("client-ready", (roomId: string, name: string) => {
    socket.to(roomId).emit("get-state");
    socket.to(roomId).emit("get-members", name);
  });

  socket.on("client-ready-leader", (roomId: string, name: string) => {
    socket.to(roomId).emit("get-state");
    io.to(roomId).emit("get-members", name);
  });

  socket.on(
    "receive-members",
    (roomId: string, members: string[], name: string) => {
      io.to(roomId).emit("update-members", members, name);
    }
  );

  socket.on("startgame", (roomId: string) => {
    io.to(roomId).emit("startgame");
  });

  socket.on("finishgame", (roomId: string) => {
    io.to(roomId).emit("finishgame");
  });

  socket.on("updateCounter", ({ roomId, index, userName, correct }) => {
    console.log(`Received updateCounter event from ${roomId}`);
    io.to(roomId).emit("updateCounter", { roomId, index, userName, correct });
  });
  socket.on("exit", (roomId: string, name: string) => {
    socket.to(roomId).emit("remove-member", name);
  });

  socket.on("canvas-state", (state: string, roomId: string) => {
    socket.to(roomId).emit("canvas-state-from-server", state);
  });

  socket.on("handleClear", (roomId: string) => {
    io.to(roomId).emit("handleClear");
  });

  // ########## QUIZ - ROUNDS ########## //
  socket.on("join-quiz-room", ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
  });

  socket.on("quiz-client-ready", (roomId: string, name: string) => {
    socket.to(roomId).emit("get-state");
    socket.to(roomId).emit("get-members", name);
  });

  socket.on("quiz-client-ready-leader", (roomId: string, name: string) => {
    socket.to(roomId).emit("get-state");
    io.to(roomId).emit("get-members", name);
  });

  socket.on("startQuiz", (roomId: string) => {
    io.to(roomId).emit("startQuiz");
  });

  socket.on("quiz-finishGame", (roomId: string) => {
    console.log("GAME FINISHED");
    io.to(roomId).emit("quiz-finishGame");
  });
  socket.on("quiz-exit", (roomId: string, name: string) => {
    socket.to(roomId).emit("remove-member", name);
  });

  socket.on("updateQuizCounter", ({ roomId, index }) => {
    io.to(roomId).emit("updateQuizCounter", { roomId, index });
  });

  socket.on("updateQuizState", ({ roomId, index, correct, userName }) => {
    io.to(roomId).emit("updateQuizState", { roomId, index, correct, userName });
  });
  socket.on("timeOut", ({ roomId }) => {
    io.to(roomId).emit("timeOut", { roomId });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running at ${PORT} `);
});
