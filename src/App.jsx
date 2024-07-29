import { useCallback, useEffect, useRef, useState } from "react";

export default function App() {
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const f1 = useRef(Math.floor(Math.random() * 10));
  const f2 = useRef(Math.floor(Math.random() * 10));
  const f3 = useRef(Math.floor(Math.random() * 10));

  const initialFloors = [f1.current, f2.current, f3.current];

  const shortestDisatance = useCallback(() => {
    if (f1.current <= f2.current && f1.current <= f3.current) {
      return 1;
    } else if (f2.current <= f1.current && f2.current <= f3.current) {
      return 2;
    } else {
      return 3;
    }
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-around">
      {initialFloors.map((item, index) => (
        <LiftLane
          key={index}
          serial={index + 1}
          initialFloor={item}
          isButtonPressed={isButtonPressed}
          setIsButtonPressed={setIsButtonPressed}
          short={shortestDisatance}
        />
      ))}
    </div>
  );
}

function LiftLane({
  serial,
  initialFloor,
  isButtonPressed,
  setIsButtonPressed,
  short,
}) {
  const [currentFloor, setCurrentFloor] = useState(initialFloor);
  function handleButtonPressed() {
    if (isButtonPressed) {
      return;
    }

    setIsButtonPressed(true);
  }

  useEffect(() => {
    if (!isButtonPressed) {
      return;
    }

    if (short() != serial) {
      return;
    }

    const id = setTimeout(() => {
      if (currentFloor > 0) {
        setCurrentFloor((prev) => prev - 1);
      } else {
        setIsButtonPressed(false);
      }
    }, 1000);

    return () => clearTimeout(id);
  }, [currentFloor, isButtonPressed]);

  return (
    <div className="flex  gap-2 flex-col-reverse">
      <div className="flex flex-col gap-2">
        <button
          className={isButtonPressed ? currentButtonStyle : offButtonStyle}
          onClick={handleButtonPressed}
        >
          Up
        </button>
      </div>
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <Lift key={index} floor={index} isCurrent={currentFloor == index} />
        ))}
      <h1 className="self-center">Lift - {serial}</h1>
    </div>
  );
}

function Lift({ floor, isCurrent }) {
  return (
    <div className={isCurrent ? currentLiftStyle : liftStyle}>{floor}</div>
  );
}

const offButtonStyle = "p-1 border border-black rounded-md bg-gray-100";
const currentButtonStyle = "p-1 border border-green-500 rounded-md bg-blue-500";

const liftStyle =
  "h-[50px] w-[50px] border border-black flex justify-center items-center bg-slate-300";
const currentLiftStyle =
  "h-[50px] w-[50px] flex justify-center items-center bg-green-500 text-white";
