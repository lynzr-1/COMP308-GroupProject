import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/Audio/audioSceneComponent";
import { generateMazeArray, generateMazeMeshes } from "./generateMaze";
import { loadAssets } from "./assetLoader";
import setupPlayerControls from "./playerControls";
import { tileSize } from "./constants";
import { placeCoins } from "./collectibles";
import { checkCoinCollection } from "./collectibles";
import { spawnEnemy, startEnemyPatrol } from "./enemyAI";

export function createScene(engine, canvas) {

    const scene = new BABYLON.Scene(engine);
    const levelStartTime = Date.now();

    //initialize player mesh variable
    let playerMesh = null;

    //change background colour
    scene.clearColor = new BABYLON.Color4(0.1176, 0.1098, 0.1294, 0.5);

    //-----AUDIO
    const coinSound = new BABYLON.Sound("coinSound", "/assets/coinSound.mp3", scene, null, { volume: 1.0, });

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
        const mazeArray = generateMazeArray(15, 15); //<--can change the size if needed but HAS to be odd numbers
        scene.metadata = scene.metadata || {};
        scene.metadata.mazeArray = mazeArray;

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
    
        //-----CAMERA & PLAYER CONTROLS
        setupPlayerControls(scene, playerStart).then(player => {

            playerMesh = player;

            //set up camera
            const camera = new BABYLON.FollowCamera("followCam", playerMesh.position, scene);
            camera.lockedTarget = playerMesh;
            camera.radius = 5;
            camera.heightOffset = 20;
            camera.cameraAcceleration = 0.02;
            camera.maxCameraSpeed = 2;
            camera.lowerRadiusLimit = 10;
            camera.upperRadiusLimit = 10;
            camera.useFixedFraming = true;
            camera.allowAutoRotation = false;
            camera.attachControl(canvas, true);
            camera.inputs.clear();
            scene.activeCamera = camera;

            //add collectibles
            placeCoins(scene, 15);

//-----INSTANTIATE AND ADD ENEMIES TO SCENE-----//
            spawnEnemy(scene, scene.metadata.mazeArray).then(enemyMesh => {
                const enemyObj = scene.metadata.enemies[0];
                startEnemyPatrol(
                    scene,
                    scene.metadata.enemies[0],
                    scene.metadata.mazeArray,
                    () => {
                      const playerPos = playerMesh.position;
                      return {
                        x: Math.floor(playerPos.x / tileSize),
                        z: Math.floor(playerPos.z / tileSize),
                      };
                    }
                  );
            });
            
            //check for collisions with collectibles
            let scoreSubmitted = false;

            scene.onBeforeRenderObservable.add(() => {
                checkCoinCollection(scene, playerMesh, coinSound);
            
                // Submit score once when all coins are collected
                if (!scoreSubmitted && scene.metadata.coins?.length === 0) {
                    scoreSubmitted = true;
            
                    const score = scene.metadata?.score || 0;
                    const level = 1;
            
                    import("../utils/scoreSubmit").then(({ submitScore }) => {
                        const timeTaken = Math.floor((Date.now() - levelStartTime) / 1000); // seconds
                        submitScore(score, level, timeTaken);
                    });
                }
            });
            
        });
    });

    return scene;
}