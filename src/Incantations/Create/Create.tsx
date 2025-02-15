import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { defaultIncantation, saveIncantation } from "../../store/incantations";

export const Create = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const onClick = () => {
    dispatch(
      saveIncantation({
        name,
        content: defaultIncantation,
      })
    );
    setName("");
  };
  return (
    <>
      <input
        type="text"
        placeholder="New Incantation Name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={onClick} disabled={name === ""}>
        Create Incantation
      </button>
    </>
  );
};
