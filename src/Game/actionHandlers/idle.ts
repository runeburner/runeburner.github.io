import { ActionProgress } from "../../types/actions";

const maker = (): ActionProgress | true | null => null;
const processor = (): boolean => true;

export const idleHandler = [maker, processor] as const;
