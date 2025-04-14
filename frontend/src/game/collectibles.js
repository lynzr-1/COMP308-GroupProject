import * as BABYLON from "@babylonjs/core";
import { tileSize } from "./constants";
import { updatePlayerHealth } from "./playerHealth";

//============ HEALTH COLLECTIBLES ============//

export function placeHearts(scene, count = 1) {

    const mazeArray = scene.metadata?.mazeArray;
    const heartTemplate = scene.metadata?.heartTemplate;

    if (!mazeArray || !heartTemplate) {
        console.warn("Missing maze or heart template!", {
            mazeArray,
            heartTemplate
        });
        
        return;
    }

    const heartsPlaced = [];

    let safetyCounter = 0; 

    while (heartsPlaced.length < count && safetyCounter < 500) {

        const x = Math.floor(Math.random() * mazeArray[0].length);
        const z = Math.floor(Math.random() * mazeArray.length);
        const tileType = mazeArray[z][x];
        const heartsAlreadyPlaced = heartsPlaced.some(p => p.x === x && p.z === z);
            
            if (tileType === 0 && !heartsAlreadyPlaced) {
                const heart = heartTemplate.clone(`heart-${x}-${z}`, null, true);
                heart.position = new BABYLON.Vector3(-x * tileSize, 1.0, z * tileSize);
                heart.scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);
                heart.rotation.y = Math.random() * Math.PI;   
                heart.setEnabled(true);
                scene.addMesh(heart);
                console.log(`Heart spawned at (${x}, ${z})`);
                heartsPlaced.push({ x, z, mesh: heart });
            }
            
        safetyCounter++;
    }     

    scene.metadata.hearts = heartsPlaced;

        //animate hearts to rotate
        scene.onBeforeRenderObservable.add(() => {
            const hearts = scene.metadata.hearts || [];
            hearts.forEach(({ mesh }) => {
                if (mesh && mesh.isEnabled()) {
                    mesh.rotate(BABYLON.Axis.Y, 0.03, BABYLON.Space.LOCAL);
                }
            });
        });

}

  //---check if player collides with a heart
  export function checkHeartCollection(scene, playerMesh) {

    const hearts = scene.metadata?.hearts || [];
  
    //filter out collected hearts
    scene.metadata.hearts = hearts.filter(({ mesh }) => {

        const heartCenter = mesh.getBoundingInfo().boundingBox.centerWorld;
        const playerPos = playerMesh.position;      
        const dist = BABYLON.Vector3.Distance(heartCenter, playerPos);
    
        if (dist < 1.5) {
            mesh.setEnabled(false); //hide collected heart

            updatePlayerHealth(scene, 20);
            
            return false;
        }
    
        return true;
    });

    // ---RESPAWN HEARTS IF ALL COLLECTED---
    if (scene.metadata.hearts.length === 0 && !scene.metadata.gameOver) {
        console.log("All hearts collected! Respawning...");
        placeHearts(scene, 1);
    }
}

//============ COIN COLLECTIBLES ============//

//---place coins in the scene
export function placeCoins(scene, count = 10) {

    const mazeArray = scene.metadata?.mazeArray;
    const coinTemplate = scene.metadata?.coinTemplate;
  
    if (!mazeArray || !coinTemplate) {
        console.warn("Missing maze or coin template!", {
            mazeArray,
            coinTemplate
        });
        
        return;
    }
 
    const placed = [];

    let safetyCounter = 0; 
  
    while (placed.length < count && safetyCounter < 500) {

        const x = Math.floor(Math.random() * mazeArray[0].length);
        const z = Math.floor(Math.random() * mazeArray.length);
        const tileType = mazeArray[z][x];
        const alreadyPlaced = placed.some(p => p.x === x && p.z === z);
            
            if (tileType === 0 && !alreadyPlaced) {
                const coin = coinTemplate.clone(`coin-${x}-${z}`, null, true);
                coin.position = new BABYLON.Vector3(-x * tileSize, 0.5, z * tileSize);
                coin.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
                coin.rotation.y = Math.random() * Math.PI;   
                coin.setEnabled(true);
                scene.addMesh(coin);
                placed.push({ x, z, mesh: coin });
            }
            
        safetyCounter++;
    }     

    scene.metadata.coins = placed;

    //animate coins to rotate
    scene.onBeforeRenderObservable.add(() => {
        const coins = scene.metadata.coins || [];
        coins.forEach(({ mesh }) => {
            if (mesh && mesh.isEnabled()) {
                mesh.rotate(BABYLON.Axis.Y, 0.03, BABYLON.Space.LOCAL);
            }
        });
    });
}

  //---check if player collides with coins & collect them
  export function checkCoinCollection(scene, playerMesh, coinSound) {

    const coins = scene.metadata?.coins || [];
  
    //filter out collected coins
    scene.metadata.coins = coins.filter(({ mesh }) => {

        const coinCenter = mesh.getBoundingInfo().boundingBox.centerWorld;
        const playerPos = playerMesh.position;      
        const dist = BABYLON.Vector3.Distance(coinCenter, playerPos);
    
        if (dist < 1.5) {
            mesh.setEnabled(false); //hide collected coin
            scene.metadata.score = (scene.metadata.score || 0) + 1; //increment score

            //play coin collect sound if it's ready
            if (coinSound && coinSound.isReady()) {
                coinSound.play();
            }

            //update score
            if (scene.metadata.ui?.coinBg?.children?.[0]) {
                scene.metadata.ui.coinBg.children[0].text = `SCORE: ${scene.metadata.score}`;
            }
            
            console.log("Coin Collected! Score:", scene.metadata.score);
            return false;
        }
    
        return true;
    });

    // ---RESPAWN COINS IF ALL COLLECTED---
    if (scene.metadata.coins.length === 0 && !scene.metadata.gameOver) {
        console.log("All coins collected! Respawning...");
        placeCoins(scene, 20);
    }
}
  