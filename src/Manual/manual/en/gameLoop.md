# Game Loop

Runeburner is played by animating golems, those golems have a set of runes that dictates their abilities and an incantation that dictates their actions. Golems move on a 2d grid and perform various actions on the world. The current goal of the game is to collect rune crystals and attune at the heart.

The game runs at 30 FPS. Each frame the game will run every incantation once to get the action that that golem should perform. Then it will filter out actions that are impossible to perform. Finally it will add progress to every action as actions are not instantaneous.
