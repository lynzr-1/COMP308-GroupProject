import { Sound } from "@babylonjs/core/Audio/sound";

export const tileSize = 2;
export const wallHeight = 2;

///----AUDIO

export function createCoinSound(scene) {
    return new Sound("coinSound", "/assets/coinSound.mp3", scene, null, {
        spatialSound: false,
        volume: 1,
    });
}