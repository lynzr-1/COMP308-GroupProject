import { useEffect } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export default function Game() {

  useEffect(() => {

    //get the canvas element
    const canvas = document.getElementById("game-canvas");
    //create a Babylon.js engine
    const engine = new BABYLON.Engine(canvas, true);
    //create a new scene
    const scene = new BABYLON.Scene(engine);

    //-----------------------------------------------------------------------------------//
    //-----------------------------------MAZE CREATION-----------------------------------//

    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const tileSize = 1;
    const wallHeight = 2;

    //store player position in maze coordinates
    let playerMazePos = { x: 1, z: 1 };

     //create maze (loop through maze array)
     for (let z = 0; z < maze.length; z++) {
        for (let x = 0; x < maze[z].length; x++) {
            const tile = maze[z][x];
  
            //floor
            const floor = BABYLON.MeshBuilder.CreateGround(`floor-${x}-${z}`, { width: tileSize, height: tileSize }, scene);
            floor.position.x = x * tileSize;
            floor.position.z = z * tileSize;
  
          //wall
            if (tile === 1) {
                const wall = BABYLON.MeshBuilder.CreateBox(`wall-${x}-${z}`, { width: tileSize, height: wallHeight, depth: tileSize }, scene);
                wall.position.x = x * tileSize;
                wall.position.y = wallHeight / 2;
                wall.position.z = z * tileSize;
                wall.material = new BABYLON.StandardMaterial("wallMat", scene);
                wall.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            }
        }
    }

    //-----------------------------------------------------------------------------------//
    //---------------------------------------PLAYER--------------------------------------//
    
    //player cube placeholder
    const player = BABYLON.MeshBuilder.CreateBox("player", { size: 1.5 }, scene);
    player.position.y = 0.75;
    
    //player material
    const playerMat = new BABYLON.StandardMaterial("playerMat", scene);
    playerMat.diffuseColor = new BABYLON.Color3(1, 1, 0.2); // bright yellow
    player.material = playerMat;
    
    //player position
    const updatePlayerPosition = () => {
        player.position.x = playerMazePos.x * tileSize;
        player.position.z = playerMazePos.z * tileSize;
    };

    updatePlayerPosition();

    //-----------------------------------------------------------------------------------//
    //-----------------------------------CAMERA SETUP------------------------------------//

    const mazeWidth = maze[0].length;
    const mazeHeight = maze.length;
    const centerX = (mazeWidth - 1) * tileSize / 2;
    const centerZ = (mazeHeight - 1) * tileSize / 2;

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        BABYLON.Tools.ToRadians(90),   //alpha/horizontal orbit) facing diagonally
        BABYLON.Tools.ToRadians(30),    //beta/vertical angle tilt downward
        Math.max(mazeWidth, mazeHeight) * 2,  // Radius => how far from center
        new BABYLON.Vector3(centerX, 0, centerZ),  // Target => maze center
        scene
    );

    camera.setTarget(new BABYLON.Vector3(centerX, 0, centerZ));

    camera.inputs.clear(); // disable user controls

    //add light to illuminate the scene
    const light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    //-----------------------------------------------------------------------------------//
    //----------------------------------MOVEMENT/INPUTS----------------------------------//

    scene.onKeyboardObservable.add((kbInfo) => {
        if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
          let { x, z } = playerMazePos;
          if (kbInfo.event.key === "w") z -= 1;
          if (kbInfo.event.key === "s") z += 1;
          if (kbInfo.event.key === "a") x += 1;
          if (kbInfo.event.key === "d") x -= 1;
  
          //bounds and wall check
          if (
            z >= 0 && z < maze.length &&
            x >= 0 && x < maze[z].length &&
            maze[z][x] === 0
          ) {
            playerMazePos = { x, z };
            updatePlayerPosition();
          }
        }
      });

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
      <canvas id="game-canvas" style={{ width: "100%", height: "800px" }} />
    </div>
  );
}
