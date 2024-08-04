// App.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Shuffle function
function shuffleArray() {
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Timer Component
function Timer({ time, setTime, timerActive }) {
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timerActive]);

  return <p>Time: {time}s</p>;
}

// Tile Components
function FilledTile({ index, value, dragStart }) {
  return (
    <div
      id={`place-${index + 1}`}
      className={
        "shadow w-20 h-20 rounded " +
        (index == value - 1
          ? "bg-gradient-to-r from-pink-500 to-yellow-500"
          : "bg-gray-900")
      }
    >
      <p
        id={`tile-${value}`}
        draggable="true"
        onDragStart={dragStart}
        className="fw-bold text-xl grid grid-cols-1 place-items-center w-20 h-20 rounded cursor-pointer hover:bg-gray-800"
      >
        {value}
      </p>
    </div>
  );
}

function EmptyTile({ dragOver, dropped, index }) {
  return (
    <div
      onDragOver={dragOver}
      onDrop={dropped}
      id={`place-${index + 1}`}
      className="bg-gray-900 shadow w-20 h-20 rounded"
    ></div>
  );
}

// Puzzle Component
function Puzzle({ shuffledArray, dragOver, dragStart, dropped }) {
  return (
    <div className="grid grid-cols-4 gap-8 mt-6 px-6 rounded">
      {shuffledArray.map((value, index) => {
        if (value === "")
          return <EmptyTile key={index} dragOver={dragOver} dropped={dropped} index={index} />;
        return <FilledTile key={index} index={index} value={value} dragStart={dragStart} />;
      })}
    </div>
  );
}

// Game Component
function Game() {
  const [shuffledArray, setShuffledArray] = useState(shuffleArray());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [win, setWin] = useState(false);
  const navigate  = useNavigate();

  useEffect(() => {
    if (moves === 1) setTimerActive(true);
    let won = true;
    for (let i = 0; i < shuffledArray.length - 1; i++) {
      const value = shuffledArray[i];
      if (i == value - 1) continue;
      else {
        won = false;
        break;
      }
    }
    if (won) {
      setWin(true);
      setTimerActive(false);
    }
    return;
  }, [moves]);

  const newGame = () => {
    setMoves(0);
    setTimerActive(false);
    setTime(0);
    setShuffledArray(shuffleArray());
    setWin(false);
  };

  const dragStart = (e) => e.dataTransfer.setData("tile", e.target.id);

  const dragOver = (e) => e.preventDefault();

  const dropped = (e) => {
    e.preventDefault();
    const tile = e.dataTransfer.getData("tile");
    const oldPlace = Number(document.getElementById(tile).parentElement.id.slice(6)) - 1;
    const newPlace = Number(e.target.id.slice(6)) - 1;

    if (!(Math.abs(oldPlace - newPlace) == 4 || Math.abs(oldPlace - newPlace) == 1)) return;

    const [i, j] = [Math.min(oldPlace, newPlace), Math.max(oldPlace, newPlace)];
    setShuffledArray([
      ...shuffledArray.slice(0, i),
      shuffledArray[j],
      ...shuffledArray.slice(i + 1, j),
      shuffledArray[i],
      ...shuffledArray.slice(j + 1),
    ]);
    setMoves(moves + 1);
  };

  return (
    <div className="h-screen flex text-gray-300 bg-gray-950">
      <div className="mx-auto mt-8">
        {win && (
          <div className="rounded-md border-l-4 border-green-500 bg-green-100 p-2 mb-2">
            <div className="flex items-center justify-center space-x-4">
              <p className="font-medium text-green-600">HURRAY!! You have won the game</p>
            </div>
          </div>
        )}
        <h1 className="text-3xl text-emerald-600 font-bold text-center">Puzzle Game</h1>
        <h3 className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          15 Puzzle Game
        </h3>
        <div className="flex justify-between px-6 mt-2">
          <p>Moves: {moves}</p>
          <Timer time={time} timerActive={timerActive} setTime={setTime} />
        </div>
        <Puzzle shuffledArray={shuffledArray} dragStart={dragStart} dragOver={dragOver} dropped={dropped} />
        <div className="px-6 mt-4">
          <button
            onClick={newGame}
            className="text-black font-bold block bg-gray-900 p-2 rounded w-full h-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
          >
            New Game
          </button>
          <button
            onClick={() => {navigate('/Home');}}
            className="text-black font-bold block bg-gray-900 p-2 rounded w-full h-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% mt-5"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

// App Component
export default function PuzzleGame() {
  return <Game />;
}
