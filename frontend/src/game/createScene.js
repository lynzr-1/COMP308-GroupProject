import * as BABYLON from "@babylonjs/core";
import { generateMazeArray, generateMazeMeshes } from "./generateMaze";
import { loadAssets } from "./assetLoader";
import setupPlayerControls from "./playerControls";
import { tileSize } from "./constants";

export function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);

    //lighting
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //camera
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 30, 20), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    camera.inputs.clear();

    // Load assets and build rest of scene
    loadAssets(scene, () => {

        console.log("All assets loaded.");
    
        //double check that templates were assigned
        const wallTemplate = scene.metadata?.wallTemplate;
        const floorTemplate = scene.metadata?.floorTemplate;
    
        if (!wallTemplate || !floorTemplate) {
            console.error("Missing wall or floor template!");
            return;
        }
    
        //generate and place the maze now that templates exist
        const mazeArray = generateMazeArray(15, 15);

        console.log("Wall Template:", wallTemplate);
        console.log("Floor Template:", floorTemplate);

        if (wallTemplate && floorTemplate) {
            generateMazeMeshes(scene, mazeArray, wallTemplate, floorTemplate);
        } else {
            console.error("Missing templates:", wallTemplate, floorTemplate);
        }
    
        //add player controls now that maze is done
        scene.metadata.mazeArray = mazeArray;

        const startPos = new BABYLON.Vector3(1 * tileSize, 1, 1 * tileSize);
        setupPlayerControls(scene, startPos);
    });

    return scene;
}