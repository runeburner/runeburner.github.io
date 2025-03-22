const MOVE_NEXT_TO = (v) => ({ __type: "MOVE_NEXT_TO", v: v, id: ENTITY_ID });
const MINE = (v) => ({ __type: "MINE", v: v, id: ENTITY_ID });
const ATTUNE = () => ({ __type: "ATTUNE", id: ENTITY_ID });
const DIE = () => ({ __type: "DIE", id: ENTITY_ID });
const SMASH = (id) => ({ __type: "SMASH", id: ENTITY_ID, target: id });
