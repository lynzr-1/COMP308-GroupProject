import * as BABYLON from "@babylonjs/core";
import { tileSize } from "./constants";

export default function setupPlayerControls(scene, startPos) {

  const mazeArray = scene.metadata?.mazeArray;
  const canvas = scene.getEngine().getRenderingCanvas();

  if (!mazeArray) {
    console.warn("No mazeArray found in scene metadata");
    return;
  }

  //-----LOAD PLAYER MESH

  return BABYLON.SceneLoader.LoadAssetContainerAsync("/assets/", "Dummy.glb", scene).then((container) => {
    
      container.addAllToScene();

      const character = container.meshes[0];

      let spawnX = Math.floor(startPos.x / tileSize);
      let spawnZ = Math.floor(startPos.z / tileSize);
      
      // If the tile is not walkable, find the first walkable one
      if (mazeArray[spawnZ]?.[spawnX] !== 0) {
        outer:
        for (let z = 0; z < mazeArray.length; z++) {
          for (let x = 0; x < mazeArray[0].length; x++) {
            if (mazeArray[z][x] === 0) {
              spawnX = x;
              spawnZ = z;
              break outer;
            }
          }
        }
      }
      
      //position player
      character.position = new BABYLON.Vector3(spawnX * tileSize, 0, spawnZ * tileSize);
      character.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7); //change size of player

      //animations
      const walkAnim = container.animationGroups.find(a => a.name.toLowerCase().includes("walk"));
      const idleAnim = container.animationGroups.find(a => a.name.toLowerCase().includes("idle"));      
      if (idleAnim) idleAnim.start(true);
      
      //store position
      let playerPos = { x: spawnX, z: spawnZ };

      function moveTo(newX, newZ) {
        const target = new BABYLON.Vector3(newX * tileSize, 0, newZ * tileSize);

        //rotate character to face the direction of movement
        const dx = newX - playerPos.x;
        const dz = newZ - playerPos.z;
        const angle = Math.atan2(dz, dx);
        character.rotation.y = -angle + Math.PI / 2;

        //start animations
        if (walkAnim) walkAnim.start(true);
        if (idleAnim) idleAnim.stop();

        //animate movement
        BABYLON.Animation.CreateAndStartAnimation(
          "move",
          character,
          "position",
          60,
          15,
          character.position.clone(),
          target,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
          null,
          () => {
            if (walkAnim) walkAnim.stop();
            if (idleAnim) idleAnim.start(true);
          }
        );
      }

      // Handle keyboard input
      scene.onKeyboardObservable.add((kbInfo) => {
        
        if (scene.metadata.gamePaused) return;

        if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
          let { x, z } = playerPos;

          switch (kbInfo.event.key.toLowerCase()) {
            case "w": z++; break;
            case "s": z--; break;
            case "a": x--; break;
            case "d": x++; break;
            default: return;
          }

          if (mazeArray[z]?.[x] === 0) {
            moveTo(x, z);
            playerPos = { x, z };
          }
        }
      });

      return character; 

    });
}
