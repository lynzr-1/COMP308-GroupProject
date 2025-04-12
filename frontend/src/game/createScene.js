import * as BABYLON from "@babylonjs/core";
import { generateMazeArray, generateMazeMeshes } from "./generateMaze";
import { loadAssets } from "./assetLoader";
import setupPlayerControls from "./playerControls";
import { tileSize } from "./constants";

export function createScene(engine, canvas) {

    const scene = new BABYLON.Scene(engine);

    //-----LIGHTING
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //-----TEMP CAMERA
    const fallbackCam = new BABYLON.ArcRotateCamera("fallback", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    fallbackCam.attachControl(canvas, true);
    scene.activeCamera = fallbackCam;
   
    //-----LOAD ASSETS AND BUILD SCENE
    loadAssets(scene, () => {

        console.log("All assets loaded.");
    
        //double check that templates were assigned
        const wallTemplate = scene.metadata?.wallTemplate;
        const floorTemplate = scene.metadata?.floorTemplate;
    
        if (!wallTemplate || !floorTemplate) {
            console.error("Missing wall or floor template!");
            return;
        }
    
        //generate and place the maze
        const mazeArray = generateMazeArray(21, 21); //<--can change the size if needed but HAS to be odd numbers
        scene.metadata = { mazeArray };

        if (wallTemplate && floorTemplate) {
            generateMazeMeshes(scene, mazeArray, wallTemplate, floorTemplate);
        } else {
            console.error("Missing templates:", wallTemplate, floorTemplate);
        }

        //determine player start position
        let playerStart;

        for (let z = 0; z < mazeArray.length; z++) {
            for (let x = 0; x < mazeArray[z].length; x++) {
                if (mazeArray[z][x] === 0) {
                    playerStart = new BABYLON.Vector3(x * tileSize, 0.5, z * tileSize);
                    break;
                }
            }
        if (playerStart) break;
        }
    
        //add player controls
        scene.metadata.mazeArray = mazeArray;

        //-----CAMERA
        setupPlayerControls(scene, playerStart).then(playerMesh => {
            const camera = new BABYLON.FollowCamera("followCam", playerMesh.position, scene);
            camera.lockedTarget = playerMesh;
            camera.radius = 5;
            camera.heightOffset = 20;
            camera.cameraAcceleration = 0.02;
            camera.maxCameraSpeed = 2;
            camera.lowerRadiusLimit = 10;
            camera.upperRadiusLimit = 10;
            scene.activeCamera = camera;
            camera.attachControl(canvas, true);
            camera.inputs.clear();
            scene.activeCamera = camera;
        });
    });

    return scene;
}