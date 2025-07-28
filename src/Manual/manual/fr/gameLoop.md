# Boucle du jeu

Runeburner ce joue en animant des [golems](golem), les [golems](golem) ont un ensemble de runes qui dicte leur abilités et une [incantation](incantations) qui dicte leurs actions. Les [Golems](golem) bouge sur une grille an 2d et performe différentes actions dans le [monde](world).

Le jeu roule a 30 FPS. A chaque tour le jeux execute toute les [incantations](incantations) une fois pour obtenir toutes les actions que les golems veulent faire. Ensuite le jeu filtre les actions impossible a executer. Finalement le jeux applique un progress pour chaque action puisque les actions ne sont pas immediate.
