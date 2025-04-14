import * as BABYLON from "@babylonjs/core";
import { tileSize } from "./constants";
import PF from "pathfinding";
import { updatePlayerHealth } from "./playerHealth";

//----CREATE ENEMY

export function spawnEnemy(scene, mazeArray) {
  return BABYLON.SceneLoader.LoadAssetContainerAsync("/assets/", "Skeleton_Minion.glb", scene)
    .then(container => {
      container.addAllToScene();

      const enemy = container.meshes[0];
      enemy.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);

      //spawn enemy at opposite side of map
      const spawnX = 19;
      const spawnZ = 19;

      enemy.position = new BABYLON.Vector3(spawnX * tileSize, 0, spawnZ * tileSize);

      //play animation
      const walkAnim = container.animationGroups.find(a => a.name.toLowerCase().includes("walking_a"));
      console.log(`Enemy walking animation found: (${walkAnim.name}`);
      const idleAnim = container.animationGroups.find(a => a.name.toLowerCase().includes("idle"));
      if (idleAnim) idleAnim.start(true);

      //store for future reference
      scene.metadata = scene.metadata || {};
      scene.metadata.enemies = scene.metadata.enemies || [];
      scene.metadata.enemies.push({
        mesh: enemy,
        container,
        anim: { walkAnim, idleAnim },
        tile: { x: spawnX, z: spawnZ }
      });

      console.log(`Spawned enemy at (${spawnX}, ${spawnZ})`);
      return enemy;
    })
    .catch(err => {
      console.error("Failed to load enemy:", err);
    });
}

//---MAKE ENEMY MOVE AROUND MAZE TOWARDS THE PLAYER

export function startEnemyPathfinding(scene, enemyObj, mazeArray, playerMesh) {

    const grid = new PF.Grid(mazeArray);
    const finder = new PF.AStarFinder();
  
    const moveEnemy = () => {
        const { mesh, tile, anim } = enemyObj;

        if (scene.metadata.gamePaused) return;
  
      //convert player position to tile coordinates
      const playerX = Math.floor(playerMesh.position.x / tileSize);
      const playerZ = Math.floor(playerMesh.position.z / tileSize);
  
      //clone grid because finder modifies it
      const gridClone = grid.clone();
      const path = finder.findPath(tile.x, tile.z, playerX, playerZ, gridClone);
  
      //if path has at least 2 points (current + next)
      if (path.length > 1) {
        const [ , [nextX, nextZ] ] = path;
  
        const target = new BABYLON.Vector3(nextX * tileSize, 0, nextZ * tileSize);
        const angle = Math.atan2(nextZ - tile.z, nextX - tile.x);
        mesh.rotation.y = -angle + Math.PI / 2;

          // play walk animation, stop idle when moving
            if (anim.idleAnim) anim.idleAnim.stop();
            if (anim.walkAnim) anim.walkAnim.start(true);
  
        BABYLON.Animation.CreateAndStartAnimation(
          `enemyMove-${Date.now()}`,
          mesh,
          "position",
          60,
          15,
          mesh.position.clone(),
          target,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
          null,
          () => {
            enemyObj.tile = { x: nextX, z: nextZ };
            // stop walk animation, start idle after movement ends
            if (anim.walkAnim) anim.walkAnim.stop();
            if (anim.idleAnim) anim.idleAnim.start(true);
          }
        );
      }
  
      if (!scene.metadata.gamePaused) {
        setTimeout(() => moveEnemy(), 1000);
      } //enemy moves every 1 second unless game is paused
    };
  
    moveEnemy();
  }

  //---CHECK FOR COLLISIONS WITH THE PLAYER

  export function checkEnemyPlayerCollision(scene) {
    const player = scene.metadata.player?.mesh;
    const enemies = scene.metadata.enemies || [];
  
    if (!player) return;
  
    enemies.forEach(enemy => {
      const dist = BABYLON.Vector3.Distance(player.position, enemy.mesh.position);
  
      if (dist < 1.5 && !scene.metadata.player.isInvincible) {
        updatePlayerHealth(scene, -20); // damage amount
        scene.metadata.player.isInvincible = true;
  
        //reset invincibility after short delay
        setTimeout(() => {
          scene.metadata.player.isInvincible = false;
        }, 2000); // 2 sec cooldown
      }
    });
  }