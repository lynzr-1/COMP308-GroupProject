import * as GUI from "@babylonjs/gui";

//--------START GAME OVERLAY-------//

export function showStartOverlay(scene, onStart) {

    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("startUI");

    //transparent overlay panel
    const panel = new GUI.Rectangle();
    panel.width = "100%";
    panel.height = "100%";
    panel.cornerRadius = 0;
    panel.color = "white";
    panel.thickness = 0;
    panel.background = "#000000ee";
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    ui.addControl(panel);

    // Inner stack panel to center content
    const stack = new GUI.StackPanel();
    stack.width = "500px";
    stack.height = "500px";
    stack.isVertical = true;
    stack.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    stack.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(stack);

    //logo block
    const logo = new GUI.Image();
    logo.source = "/assets/MazeRushLogo.png";
    logo.width = "250px";
    logo.height = "80px";
    logo.paddingBottom = "50px";
    stack.addControl(logo);

    //text block
    const text = new GUI.TextBlock();
    text.text = "Ready to play?";
    text.color = "white";
    text.fontSize = 32;
    text.fontFamily = "Oswald, sans-serif";
    text.height = "100px";
    text.paddingBottom = "50px";
    stack.addControl(text);

    //text block
    const smText = new GUI.TextBlock();
    smText.text = "Collect as many coins as possible before time runs out!";
    smText.color = "white";
    smText.fontSize = 20;
    smText.fontFamily = "Inconsolata, monospace";
    smText.width = "300px";
    smText.height = "100px";
    smText.paddingBottom = "50px";
    smText.textWrapping = true;
    stack.addControl(smText);

    //start button
    const button = GUI.Button.CreateSimpleButton("startBtn", "START GAME");
    button.fontFamily = "Oswald, sans-serif";
    button.width = "120px";
    button.height = "40px";
    button.color = "white";
    button.thickness = 0;
    button.cornerRadiusW = 10;
    button.cornerRadiusX = 0;
    button.cornerRadiusY = 10;
    button.cornerRadiusZ = 0;
    button.background = "#282882";

    // Hover effect
    button.onPointerEnterObservable.add(() => {
        button.background = "#5189bf";
    });
    button.onPointerOutObservable.add(() => {
        button.background = "#282882"; // back to normal
    });
    
    // Click effect
    button.onPointerDownObservable.add(() => {
        button.background = "#0d004c";
    });
    button.onPointerUpObservable.add(() => {
        button.background = "#5189bf"; // return to hover colour
    });

    button.onPointerClickObservable.add(() => {
        ui.dispose();
        onStart(); // calls the game start logic (unpauses, starts countdown, etc.)
    });
    stack.addControl(button);
}

//--------GAME OVER OVERLAY-------//

export function showGameOverOverlay(scene, finalScore = 0, achievements = []) {
  const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("gameOverUI");

    //transparent overlay panel
    const panel = new GUI.Rectangle();
    panel.width = "100%";
    panel.height = "100%";
    panel.cornerRadius = 0;
    panel.color = "white";
    panel.thickness = 0;
    panel.background = "#000000ee";
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    ui.addControl(panel);

    // Inner stack panel to center content
    const stack = new GUI.StackPanel();
    stack.width = "800px";
    stack.height = "600px";
    stack.isVertical = true;
    stack.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    stack.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(stack);

    //logo block
    const logo = new GUI.Image();
    logo.source = "/assets/MazeRushLogo.png";
    logo.width = "250px";
    logo.height = "42px";
    logo.paddingBottom = "10px";
    stack.addControl(logo);

    //game over text block
    const text = new GUI.TextBlock();
    text.text = "GAME OVER";
    text.color = "white";
    text.fontSize = 36;
    text.fontFamily = "Oswald, sans-serif";
    text.height = "75px";
    text.paddingBottom = "25px";
    stack.addControl(text);

    //if any achievements are unlocked, show them here
    if (achievements.length > 0) {
        const achievementTitle = new GUI.TextBlock();
        achievementTitle.text = "Achievements Unlocked:";
        achievementTitle.color = "#737e9b";
        achievementTitle.fontSize = 22;
        achievementTitle.marginTop = "20px";
        achievementTitle.fontFamily = "Inconsolata, monospace";
        achievementTitle.height = "50px";
        achievementTitle.paddingBottom = "20px";
        achievementTitle.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        stack.addControl(achievementTitle);

        const imageRow = new GUI.StackPanel();
        imageRow.isVertical = false;
        imageRow.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        imageRow.height = "225px";
        stack.addControl(imageRow);

        achievements.forEach(name => {
            const image = new GUI.Image("achiev", `/assets/${name}.png`);
            image.width = "150px";
            image.height = "194px";
            image.tooltipText = name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            imageRow.addControl(image);
        });
    }

    //final score text
    const scoreText = new GUI.TextBlock();
    scoreText.text = `Final Score: ${finalScore}`;
    scoreText.color = "white";
    scoreText.fontSize = 20;
    scoreText.height = "75px";
    scoreText.fontFamily = "Inconsolata, monospace";
    scoreText.paddingBottom = "25px";
    stack.addControl(scoreText);

    //play again button
    const button = GUI.Button.CreateSimpleButton("restartBtn", "PLAY AGAIN");
    button.fontFamily = "Oswald, sans-serif";
    button.width = "120px";
    button.height = "40px";
    button.color = "white";
    button.thickness = 0;
    button.cornerRadiusW = 10;
    button.cornerRadiusX = 0;
    button.cornerRadiusY = 10;
    button.cornerRadiusZ = 0;
    button.background = "#282882";
    button.top = "40px";

    // Hover effect
    button.onPointerEnterObservable.add(() => {
        button.background = "#5189bf";
    });
    button.onPointerOutObservable.add(() => {
        button.background = "#282882"; // back to normal
    });
    
    // Click effect
    button.onPointerDownObservable.add(() => {
        button.background = "#0d004c";
    });
    button.onPointerUpObservable.add(() => {
        button.background = "#5189bf"; // return to hover colour
    });

    button.onPointerClickObservable.add(() => {
        location.reload(); //reload the page to restart
    });
    stack.addControl(button);
}