# Incantations

Les incantations sont des scripts Typescript qui doivent exporter une fonction avec la signature `tick(rs: RS): Action`. Ils peuvent etre associé avec un [golem](golem) pour déterimer leur actions. La fonction `tick` est appelé a chaque tour et doit retourner l'action que le [golem](golem) devrait executer ou continuer a executer.

Les variables globales ne sont pas partager entre differente instance de la meme incantation.
