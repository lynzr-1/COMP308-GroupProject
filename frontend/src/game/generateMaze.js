import { tileSize } from "./constants";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export function generateMazeArray(width, height) {
    const maze = Array.from({ length: height }, () => Array(width).fill(1)); // fill with walls

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function carve(x, y) {
        maze[y][x] = 0; // mark this cell as path

        const directions = shuffle([
            [0, -2], // N
            [2, 0],  // E
            [0, 2],  // S
            [-2, 0], // W
        ]);

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (
                ny > 0 && ny < height &&
                nx > 0 && nx < width &&
                maze[ny][nx] === 1
            ) {
                // knock down wall between
                maze[y + dy / 2][x + dx / 2] = 0;
                carve(nx, ny);
            }
        }
    }

    //must start on an odd-numbered cell - maze MUST be odd number of tiles (i.e. 15x15)
    carve(1, 1);
    return maze;
}


export function generateMazeMeshes(scene, mazeArray, wallTemplate, floorTemplate) {
    const width = mazeArray[0].length;
    const height = mazeArray.length;

    for (let z = 0; z < height; z++) {
        for (let x = 0; x < width; x++) {
            const tile = mazeArray[z][x];
            const pos = new BABYLON.Vector3(x * tileSize, 0, z * tileSize);

            //always place floor
            const floor = floorTemplate.clone(`floor-${x}-${z}`);
            floor.position = pos.clone();
            floor.setEnabled(true);

            //place walls
            if (tile === 1) {
                const wall = wallTemplate.clone(`wall-${x}-${z}`);
                wall.position = pos.clone();
                wall.setEnabled(true);
            }
        }
    }
}

  
