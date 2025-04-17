import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/Audio/audioSceneComponent";
import { generateMazeArray, generateMazeMeshes } from "./generateMaze";
import { loadAssets } from "./assetLoader";
import setupPlayerControls from "./playerControls";
import { tileSize } from "./constants";
import { placeCoins, placeHearts } from "./collectibles";
import { checkCoinCollection, checkHeartCollection } from "./collectibles";
import { spawnEnemy, startEnemyPathfinding, checkEnemyPlayerCollision } from "./enemyAI";
import { setupUI } from "./gameUI";
import { showStartOverlay, showGameOverOverlay } from "./gameOverlays";

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
   
//-----LOAD ASSETS AND BUILD SCENE-----//
    loadAssets(scene, () => {

        console.log("All assets loaded.");
    
        //double check that templates were assigned
        const wallTemplate = scene.metadata?.wallTemplate;
        const floorTemplate = scene.metadata?.floorTemplate;
    
        if (!wallTemplate || !floorTemplate) {
            console.error("Missing wall or floor template!");
            return;
        }
    
//-----GENERATE AND PLACE THE MAZE-----//
        const mazeArray = generateMazeArray(21, 21); //<--can change the size if needed but HAS to be odd numbers
        scene.metadata = scene.metadata || {};
        scene.metadata.mazeArray = mazeArray;

        //initialize score
        scene.metadata.score = 0;

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
    
//-----CAMERA & PLAYER CONTROLS-----//
        setupPlayerControls(scene, playerStart).then(player => {

            playerMesh = player;

            //set up camera
            const camera = new BABYLON.FollowCamera("followCam", playerMesh.position, scene);
            camera.lockedTarget = playerMesh;
            camera.radius = 5;
            camera.heightOffset = 15;
            camera.cameraAcceleration = 0.02;
            camera.maxCameraSpeed = 2;
            camera.lowerRadiusLimit = 10;
            camera.upperRadiusLimit = 10;
            camera.useFixedFraming = true;
            camera.allowAutoRotation = false;
            camera.attachControl(canvas, true);
            camera.inputs.clear();
            scene.activeCamera = camera;

            //setup game UI
            setupUI(scene, player);

            //initialize player health and score
            scene.metadata.player = {
                mesh: playerMesh,
                health: 100,
                maxHealth: 100,
                isInvincible: false
            };

            //initialize game counter
            scene.metadata.timer = {
                totalTime: 90, // 90 sec
                remaining: 90
            };
            
            //initialize score
            scene.metadata.score = 0;

            //pause game until player presses start button
            scene.metadata.gameStarted = false;
            scene.metadata.gamePaused = true;
            
            showStartOverlay(scene, () => {
                scene.metadata.gameStarted = true;
                scene.metadata.gamePaused = false;

                //start the timer
                scene.metadata.timer.startTime = Date.now();

                // start enemy pathfinding only after game starts
                const enemyObj = scene.metadata.enemies[0];
                startEnemyPathfinding(scene, enemyObj, scene.metadata.mazeArray, playerMesh);
            });

            //add collectibles
            placeCoins(scene, 25);
            placeHearts(scene, 2);

//-----INSTANTIATE AND ADD ENEMIES TO SCENE-----//
            spawnEnemy(scene, scene.metadata.mazeArray);

//-----CHECK FOR COIN COLLECTION, ENEMY COLLISION & UPDATE SCORE/TIMER-----//

            scene.onBeforeRenderObservable.add(() => {

                if (scene.metadata.gamePaused) return;

                //update timer
                const timer = scene.metadata.timer;
                const now = Date.now();
                const elapsed = Math.floor((now - timer.startTime) / 1000);
                timer.remaining = Math.max(0, timer.totalTime - elapsed);

                if (scene.metadata.ui?.timerContainer?.children?.[0]) {
                    scene.metadata.ui.timerContainer.children[0].text = `Time: ${timer.remaining}`;
                }
              
                //end game if timer reaches 0 or player health is 0
                const player = scene.metadata.player;
                if (player.health <= 0 || timer.remaining <= 0) {
                    handleGameOver(scene, levelStartTime);
                }

                checkCoinCollection(scene, playerMesh, coinSound); //check if player collides with a coin
                checkHeartCollection(scene, playerMesh); //check if player collides with a heart
                checkEnemyPlayerCollision(scene); //check if player collides with an enemy
            
            });
            
        });
    });

    return scene;
}

//------GAME OVER LOGIC------//

async function handleGameOver(scene, levelStartTime) {

    if (scene.metadata.gameOver) return;

    scene.metadata.gameOver = true;
    scene.metadata.gamePaused = true;

    //initialize the achievements array
    const achievements = [];

    //stop player animations
    if (scene.metadata.player?.anim?.walkAnim) {
        scene.metadata.player.anim.walkAnim.stop();
    }
  
    const score = scene.metadata?.score || 0;
    const health = scene.metadata?.player?.health || 0;
    const level = 1;
    const timer = scene.metadata.timer;
    const timeTaken = Math.floor((Date.now() - levelStartTime) / 1000);
  
    //submit final score to back end for tracking
    import("../utils/scoreSubmit").then(({ submitScore }) => {
      submitScore(score, level, timeTaken);
    });

    //----CHECK FOR ACHIEVEMENTS
    //score achievements
        if (score >= 20) achievements.push("score_20_points");
        if (score >= 30) achievements.push("score_30_points");
        if (score >= 50) achievements.push("score_50_points");

    //health achievements
        if (health === 100) achievements.push("full_health_win");
        if (health === 20) achievements.push("barely_survived");
        if (health === 0 && timer.remaining > 0) achievements.push("fragile");

    // Submit achievements before showing overlay
    if (achievements.length > 0) {
        try {
            const { submitAchievement } = await import("../utils/achievementSubmit.js");
            await submitAchievement(achievements);
        } catch (err) {
            console.warn("Achievement submission failed", err);
        }
    }

    //show the game overlay screen with player score
    showGameOverOverlay(scene, score, achievements);
    console.log("Game Over! Final Score:", score);
}