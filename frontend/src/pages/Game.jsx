import { useEffect } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders"; // For loading external models if needed

export default function Game() {
  useEffect(() => {
    //get the canvas element
    const canvas = document.getElementById("game-canvas");
    //create a Babylon.js engine
    const engine = new BABYLON.Engine(canvas, true);
    //create a new scene
    const scene = new BABYLON.Scene(engine);

    //create a basic camera
    const camera = new BABYLON.UniversalCamera(
      "camera1",
      new BABYLON.Vector3(0, 5, -10),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero()); //look at the center of the scene
    camera.attachControl(canvas, true); //allows user control over the camera with mouse/keyboard

    //add light to illuminate the scene
    const light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    //create a basic box
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
    box.position.y = 1; // Lift the box a bit above the ground

    //render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    //resize event for responsive canvas
    window.addEventListener("resize", () => {
      engine.resize();
    });

    // clean up when component is unmounted
    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div>
      <h2>Game Page</h2>
      <canvas id="game-canvas" style={{ width: "100%", height: "500px" }} />
    </div>
  );
}
