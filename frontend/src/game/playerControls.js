import * as BABYLON from "@babylonjs/core";
import { tileSize } from "./constants";

export default function setupPlayerControls(scene, startPos) {
  const mazeArray = scene.metadata?.mazeArray;

  if (!mazeArray) {
    console.warn("No mazeArray found in scene metadata");
    return;
  }

  const playerMesh = BABYLON.MeshBuilder.CreateBox("player", { size: 1 }, scene);
  playerMesh.position = startPos.clone();

  //mze coordinates
  let playerPos = {
    x: Math.floor(startPos.x / tileSize),
    z: Math.floor(startPos.z / tileSize),
  };

  function updatePos() {
    playerMesh.position.x = playerPos.x * tileSize;
    playerMesh.position.z = playerPos.z * tileSize;
  }

  updatePos();

  scene.onKeyboardObservable.add((kbInfo) => {
    if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
      let { x, z } = playerPos;

      switch (kbInfo.event.key.toLowerCase()) {
        case "w": z--; break;
        case "s": z++; break;
        case "a": x--; break;
        case "d": x++; break;
      }

      if (mazeArray[z]?.[x] === 0) {
        playerPos = { x, z };
        updatePos();
      }
    }
  });
}
