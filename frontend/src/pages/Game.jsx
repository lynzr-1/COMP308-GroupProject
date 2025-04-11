import { useEffect } from "react";
import { createScene } from "../game/createScene";
import * as BABYLON from "@babylonjs/core";

export default function Game() {
  useEffect(() => {
    const canvas = document.getElementById("game-canvas");
    const engine = new BABYLON.Engine(canvas, true);

    const scene = createScene(engine, canvas);

    engine.runRenderLoop(() => scene.render());

    window.addEventListener("resize", () => engine.resize());

    return () => engine.dispose();
  }, []);

  return <canvas id="game-canvas" style={{ width: "100%", height: "100%" }} />;
}
