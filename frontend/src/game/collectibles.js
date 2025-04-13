import * as BABYLON from "@babylonjs/core";
import { tileSize } from "./constants";

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
        // Use bounding box center in world space
        const coinCenter = mesh.getBoundingInfo().boundingBox.centerWorld;
        const playerPos = playerMesh.position;
           
        const dist = BABYLON.Vector3.Distance(coinCenter, playerPos);
    
        if (dist < 1.5) {
            mesh.setEnabled(false); //hide collected coin
            scene.metadata.score = (scene.metadata.score || 0) + 1;

            //play coin collect sound if it's ready
            if (coinSound && coinSound.isReady()) {
                coinSound.play();
            }

            //update score
            console.log("Coin Collected! Score:", scene.metadata.score);
            return false;
        }
    
        return true;
    });
}
  