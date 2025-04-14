export function updatePlayerHealth(scene, amount) {
  const player = scene.metadata?.player;
  const ui = scene.metadata?.ui;

  if (!player) return;

  // Prevent health updates if invincible
  if (player.isInvincible) return;

  // Update health value
  player.health = Math.max(0, Math.min(player.maxHealth, player.health + amount));

  // Update health bar fill width
  if (ui?.healthBar) {
    ui.healthBar.width = `${(player.health / player.maxHealth) * 100}%`;
  }

  //Update health bar text
  if (ui?.healthLabel) {
    ui.healthLabel.text = `HEALTH: ${(player.health / 20)}`;
  }


  // Optional: show debug log
  console.log(`Player health: ${player.health}`);
}
