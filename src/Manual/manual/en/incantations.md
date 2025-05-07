# Incantations

Incantations are typescript scripts that must export a function with the signature `tick(rs: RS): Action`. Incantations can be associated with a golem in order to determine their behavior. The tick function is called every frame and must the return the action that the golem should perform or continue performing.

Global variables are not shared between different instances of the same incantation.
