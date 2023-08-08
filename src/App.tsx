import { useEffect, useRef } from "react";
import { createCanvas } from "./createScene";
import "./App.css";

function App() {
  const canvasPointer = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    createCanvas(canvasPointer.current);
  }, []);

  return <canvas ref={canvasPointer} className="canvas--container"></canvas>;
}

export default App;
