import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export function loadAssets(scene, onAssetsLoaded) {
  const assetsManager = new BABYLON.AssetsManager(scene);

  // --- WALL ---
  const wallTask = assetsManager.addMeshTask("wallTask", "", "/assets/", "bricks_B.gltf");

  wallTask.onSuccess = function(task) {
    try {
      console.log("Wall task success", task);
      if (!task.loadedMeshes.length) {
        console.error("Wall.gltf loaded but no meshes found.");
        return;
      }
      const wall = task.loadedMeshes[0];
      wall.setEnabled(false);
      scene.metadata = scene.metadata || {};
      scene.metadata.wallTemplate = wall;
    } catch (err) {
      console.error("Wall task crashed:", err);
    }
  };

    // --- FLOOR ---
    const floorTask = assetsManager.addMeshTask("floorTask", "", "/assets/", "gravel.gltf");

    //IF YOU CHANGE THE FLOOR TILE, YOU NEED TO ADJUST IT IN BLENDER FIRST

    floorTask.onSuccess = function(task) {
        try {
          console.log("Floor task success", task);
          if (!task.loadedMeshes.length) {
            console.error("Floor.gltf loaded but no meshes found.");
            return;
          }
          const floor = task.loadedMeshes[0];
          floor.setEnabled(false);
          scene.metadata = scene.metadata || {};
          scene.metadata.floorTemplate = floor;
        } catch (err) {
          console.error("Floor task crashed:", err);
        }
      };

      assetsManager.onFinish = () => {
        try {
          console.log("All assets finished loading.");
          onAssetsLoaded(scene);
        } catch (err) {
          console.error("onFinish crashed:", err);
        }
      };

    assetsManager.load();
}
