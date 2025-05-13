export type Topic = {
  [key: string]: Topic | null;
};

export const topicTree: Topic = {
  general: {
    gameLoop: null,
    musicalNotes: null,
    incantations: null,
  },
  tabs: {
    editor: null,
    world: null,
    perks: null,
    help: null,
    settings: null,
  },
  actions: {
    MOVE_NEXT_TO: null,
    MINE: null,
    SING: null,
    DIE: null,
    SMASH: null,
    IDLE: null,
  },
  runes: {
    WindRune: null,
    VoidRune: null,
    LaborRune: null,
  },
  entities: {
    golem: null,
    heart: null,
    dummy: null,
  },
  tiles: {
    rune_crystals: null,
    rocks: null,
    empty: null,
  },
};

const getTopicRecursive = (
  tree: Topic,
  breadcrumbs: string[],
  index = 0
): Topic | null => {
  if (index < breadcrumbs.length)
    return getTopicRecursive(
      tree[breadcrumbs[index]] as Topic,
      breadcrumbs,
      index + 1
    );
  return tree;
};

export const getTopic = (breadcrumbs: string[]): Topic | null => {
  if (breadcrumbs.length === 0) return topicTree;
  return getTopicRecursive(topicTree, breadcrumbs);
};
