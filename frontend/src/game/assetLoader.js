import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export function loadAssets(scene, onAssetsLoaded) {

  const assetsManager = new BABYLON.AssetsManager(scene);

  //****IF YOU CHANGE THE WALL OR FLOOR TILE SPRITE, YOU NEED TO ADJUST ITS POSITION IN BLENDER FIRST

  // --- WALL ---
  const wallTask = assetsManager.addMeshTask("wallTask", "", "/assets/", "bricks_B.gltf");

  wallTask.onSuccess = function(task) {
    try {
      if (!task.loadedMeshes.length) { return; }
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

  floorTask.onSuccess = function(task) {
    try {
      if (!task.loadedMeshes.length) { return; }
      const floor = task.loadedMeshes[0];
      floor.setEnabled(false);
      scene.metadata = scene.metadata || {};
      scene.metadata.floorTemplate = floor;
    } catch (err) {
      console.error("Floor task crashed:", err);
    }
  };
  
  // --- COLLECTIBLE HEART
  const heartTask = assetsManager.addMeshTask("heartTask", "", "/assets/", "heart_teamRed.gltf.glb");

  heartTask.onSuccess = function(task) {
    try {
      if (!task.loadedMeshes.length) { return; }
      const heart = task.loadedMeshes.find(mesh => mesh.name.toLowerCase().includes("heart") && mesh.getTotalVertices() > 0);
      heart.setEnabled(false);
      scene.metadata = scene.metadata || {};
      scene.metadata.heartTemplate = heart;
    } catch (err) {
      console.error("Heart task crashed:", err);
    }
  };

  // --- COLLECTIBLE STAR
  const starTask = assetsManager.addMeshTask("starTask", "", "/assets/", "star.gltf.glb");

  starTask.onSuccess = function(task) {
    try {
      if (!task.loadedMeshes.length) { return; }
      const star = task.loadedMeshes[0];
      star.setEnabled(false);
      scene.metadata = scene.metadata || {};
      scene.metadata.starTemplate = star;
    } catch (err) {
      console.error("Star task crashed:", err);
    }
  };

  // --- COLLECTIBLE COIN
  const coinTask = assetsManager.addMeshTask("coinTask", "", "/assets/", "coin.gltf");

  coinTask.onSuccess = function(task) {
    try {
      if (!task.loadedMeshes.length) { return; }
      const coin = task.loadedMeshes.find(mesh => mesh.name.toLowerCase().includes("coin") && mesh.getTotalVertices() > 0);
      coin.setEnabled(false);
      scene.metadata = scene.metadata || {};
      scene.metadata.coinTemplate = coin;
    } catch (err) {
      console.error("Coin task crashed:", err);
    }
  };
  
  // --- WHEN ASSETS FINISH LOADING
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
