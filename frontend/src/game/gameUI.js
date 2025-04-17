import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

export function setupUI(scene, player) {
  const uiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("gameUI");

  //health bar background
  const healthBg = new GUI.Rectangle();
  healthBg.width = "150px";
  healthBg.height = "30px";
  healthBg.cornerRadiusW = 10;
  healthBg.cornerRadiusX = 0;
  healthBg.cornerRadiusY = 10;
  healthBg.cornerRadiusZ = 0;
  healthBg.background = "gray";
  healthBg.color = "transparent";
  healthBg.thickness = 0;
  healthBg.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  healthBg.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  healthBg.left = "25px";
  healthBg.top = "25px";
  uiTexture.addControl(healthBg);

  //health bar fill
  const healthBar = new GUI.Rectangle();
  healthBar.width = 1;
  healthBar.height = 1;
  healthBar.cornerRadiusW = 10;
  healthBar.cornerRadiusX = 0;
  healthBar.cornerRadiusY = 10;
  healthBar.cornerRadiusZ = 0;
  healthBar.color = "transparent";
  healthBar.thickness = 0;
  healthBar.background = "red";
  healthBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  healthBar.left = "0px";
  healthBar.transformCenterX = 0;
  healthBg.addControl(healthBar);

  //health bar label
    const healthLabel = new GUI.TextBlock();
    healthLabel.text = `HEALTH: 5`;
    healthLabel.color = "white";
    healthLabel.fontSize = 16;
    healthLabel.fontFamily = "Oswald, sans-serif";
    healthLabel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    healthLabel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    healthLabel.top = "2px";
    healthBg.addControl(healthLabel);

  //coin bar background
  const coinBg = new GUI.Rectangle();
  coinBg.width = "150px";
  coinBg.height = "30px";
  coinBg.cornerRadiusW = 10;
  coinBg.cornerRadiusX = 0;
  coinBg.cornerRadiusY = 10;
  coinBg.cornerRadiusZ = 0;
  coinBg.background = "#282882";
  coinBg.color = "transparent";
  coinBg.thickness = 0;
  coinBg.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  coinBg.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  coinBg.left = "-25px";
  coinBg.top = "25px";
  uiTexture.addControl(coinBg);

  //coin counter
  const coinText = new GUI.TextBlock();
  coinText.text = "SCORE: 0";
  coinText.color = "white";
  coinText.fontSize = 16;
  coinText.fontFamily = "Oswald, sans-serif";
  coinText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  coinText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  coinText.top = "2px";
  coinBg.addControl(coinText);

  //timer container
  const timerContainer = new GUI.Rectangle();
  timerContainer.width = "400px";
  timerContainer.height = "50px";
  timerContainer.background = "#ffffff00";
  timerContainer.top = "25px";
  timerContainer.thickness = 0;
  timerContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  timerContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  uiTexture.addControl(timerContainer);

  //timer text
  const timerText = new GUI.TextBlock();
  timerText.text = "Time: 60";
  timerText.color = "white";
  timerText.fontSize = 32;
  timerText.fontFamily = "Oswald, sans-serif";
  timerText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  timerText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  timerContainer.addControl(timerText);

  // store references in metadata
  scene.metadata = scene.metadata || {};
  scene.metadata.ui = {
    healthBar,
    healthLabel,
    coinBg,
    timerContainer
  };
}
