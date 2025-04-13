import * as BABYLON from "@babylonjs/core";
import { tileSize } from "./constants";

//----CREATE ENEMY

export function spawnEnemy(scene, mazeArray) {
  return BABYLON.SceneLoader.LoadAssetContainerAsync("/assets/", "Skeleton_Minion.glb", scene)
    .then(container => {
      container.addAllToScene();

      const enemy = container.meshes[0];
      enemy.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);

      //spawn enemy at opposite side of map
      const spawnX = 13;
      const spawnZ = 1;

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

export function startEnemyPatrol(scene, enemyObj, mazeArray, getPlayerPosition) {
    const directions = [
      { x: 1, z: 0 },
      { x: -1, z: 0 },
      { x: 0, z: 1 },
      { x: 0, z: -1 },
    ];
  
    const moveEnemy = () => {
      const { mesh, tile } = enemyObj;
  
      const playerTile = getPlayerPosition();
      const dx = playerTile.x - tile.x;
      const dz = playerTile.z - tile.z;
  
      // Always move toward player (basic chase logic)
      let dir = { x: 0, z: 0 };
      if (Math.abs(dx) > Math.abs(dz)) {
        dir.x = dx > 0 ? 1 : -1;
      } else {
        dir.z = dz > 0 ? 1 : -1;
      }
  
      const newX = tile.x + dir.x;
      const newZ = tile.z + dir.z;
  
      if (mazeArray[newZ]?.[newX] === 0) {
        const target = new BABYLON.Vector3(newX * tileSize, 0, newZ * tileSize);
  
        const angle = Math.atan2(dir.z, dir.x);
        mesh.rotation.y = -angle + Math.PI / 2;
  
        if (enemyObj.anim?.walkAnim) enemyObj.anim.walkAnim.start(true);
  
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
            enemyObj.tile = { x: newX, z: newZ };
  
            if (enemyObj.anim?.walkAnim) enemyObj.anim.walkAnim.stop();
            if (enemyObj.anim?.idleAnim) enemyObj.anim.idleAnim.start(true);
            console.log(`Enemy moved to (${newX}, ${newZ})`);
          }
        );
      }
  
      setTimeout(moveEnemy, 2000); // keep chasing
    };
  
    setTimeout(moveEnemy, 2000); // start after 2 seconds
  }