# Game Loop

Runeburner is played by animating [golems](golem), those [golems](golem) have a set of runes that dictates their abilities and an [incantation](incantations) that dictates their actions. [Golems](golem) move on a 2d grid and perform various actions on the [world](world). The current goal of the game is to collect [rune crystals](rune_crystals) and [sing](SING) at the [heart](heart).

The game runs at 30 FPS. Each frame the game will run every [incantation](incantations) once to get the action that that [golem](golem) should perform. Then it will filter out actions that are impossible to perform. Finally it will add progress to every action as actions are not instantaneous.
