import { Vec } from "../types/vec";

export type Realm = {
  id: string;
  location: Vec;
  parent?: string;
};

export const Realms: Realm[] = [
  {
    id: "tutorial_0",
    location: [19, 11],
  },
  {
    id: "tutorial_1",
    location: [18, 13],
    parent: "tutorial_0",
  },
];
