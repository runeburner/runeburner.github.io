import { Context, createContext } from "react";
import type { Game } from "../Game/game";

export const GameContext = createContext(null) as unknown as Context<Game>;
