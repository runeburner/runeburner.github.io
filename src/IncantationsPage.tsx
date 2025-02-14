import { CreateIncantationForm } from "./CreateIncantationForm";
import { useAppDispatch } from "./store/hooks";
import { useIncantationNames } from "./store/incantations";
import { loadModel } from "./store/monacoModels";
import { changeTab, useIsTabSelected } from "./store/sidebar";
import { store } from "./store/store";

export const IncantationsPage = () => {
  const is = useIsTabSelected("INCANTATIONS");
  const names = useIncantationNames();
  const dispatch = useAppDispatch();
  if (!is) return <></>;
  return (
    <>
      <ul>
        {names.map((n) => (
          <li
            key={n}
            onClick={() => {
              dispatch(changeTab("EDITOR"));
              dispatch(
                loadModel({
                  name: n,
                  content: store.getState().incantations[n],
                  isDirty: false,
                })
              );
            }}
          >
            {n}
          </li>
        ))}
      </ul>
      <CreateIncantationForm />
    </>
  );
};
