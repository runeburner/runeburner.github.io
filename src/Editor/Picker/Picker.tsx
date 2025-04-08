import { useTranslation } from "react-i18next";
import { useIncantationNames } from "../../store/incantations";
import { loadModel } from "../../store/monacoModels";
import { store } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";

export const Picker = (): React.ReactElement => {
  const { t } = useTranslation();
  const incantations = useIncantationNames();
  const dispatch = useAppDispatch();

  const onIncantationSelected = (name: string) => (): void => {
    dispatch(
      loadModel({
        name: name,
        content: store.getState().incantations[name],
        isDirty: false,
      })
    );
  };
  return (
    <div className="m-4">
      <p>{t("editor.choose_incantation")}</p>
      <ul>
        {incantations.map((i) => (
          <li className="w-full" key={i} onClick={onIncantationSelected(i)}>
            <button className="p-1 m-1 w-full">{i}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
