import { game } from "../../Game/game";
import { eq } from "../../types/vec";
import { makeThrottledUse } from "../uiThrottler";

// const useEntityPos = (id: number): Vec => {
//   const ref = useRef<Vec>(game.entityM[id].pos);
//   const [pos, setPos] = useState<Vec>(game.entityM[id].pos);
//   useUIThrottle(() => {
//     if (eq(ref.current, pos)) return;
//     setPos([...ref.current]);
//   });

//   useEffect(() => {
//     entityUpdatePosMap[id] = (p) => {
//       ref.current = p;
//       uiUpdate();
//     };
//     return () => {
//       delete entityUpdatePosMap[id];
//     };
//   }, [id]);
//   return pos;
// };

export const [actionUpdateMap, useAction] = makeThrottledUse(
  (id) => game.actionM[id]
);

// export const actionUpdateMap: Record<string, (a: ActionProgress) => void> = {};

// export const useAction = (id: number): ActionProgress => {
//   const ref = useRef<ActionProgress>(game.actionM[id]);
//   const [action, setAction] = useState<ActionProgress>(game.actionM[id]);
//   useUIThrottle(() => {
//     if (ref.current === action) return;
//     setAction(ref.current);
//   });

//   useEffect(() => {
//     actionUpdateMap[id] = (p) => {
//       ref.current = p;
//       uiUpdate();
//     };
//     return () => {
//       delete actionUpdateMap[id];
//     };
//   }, [id]);
//   return action;
// };

export const [progressUpdateMap, useActionProgress] = makeThrottledUse(
  (id) => game.actionM[id]?.progress ?? [0, 0],
  eq
);

export const [progressPosUpdateMap, useActionProgressPos] = makeThrottledUse(
  (id) => game.actionM[id]?.pos ?? [0, 0],
  eq
);
