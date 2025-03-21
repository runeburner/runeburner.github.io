import { useState } from "react";
import { Modal } from "../Modal/Modal";
import ENFlag from "./en.svg";
import FRFlag from "./fr.svg";
import classes from "./I18NPicker.module.css";
import i18n from "./i18n";

export const CHOSEN_LANGUAGE_KEY = "LANGUAGE";

type FlagProps = {
  FlagSVG: string;
  className: string;
};

const Flag = ({ FlagSVG, className }: FlagProps): React.ReactElement => {
  return (
    <div className={className}>
      <FlagSVG />
    </div>
  );
};

type FlagPickProps = {
  name: string;
  onClick: () => void;
  FlagSVG: string;
  className: string;
};

const FlagPick = (props: FlagPickProps): React.ReactElement => {
  return (
    <div
      className="flex flex-col items-center m-4 cursor-pointer"
      onClick={props.onClick}
    >
      <Flag className={props.className} FlagSVG={props.FlagSVG} />
      <p className="mt-2">{props.name}</p>
    </div>
  );
};

export const I18NPicker = (): React.ReactElement => {
  const lang = localStorage.getItem(CHOSEN_LANGUAGE_KEY);
  const [open, setOpen] = useState(true);
  if (lang !== null) return <></>;

  const onPick = (short: string) => (): void => {
    i18n.changeLanguage(short);
    setOpen(false);
    localStorage.setItem(CHOSEN_LANGUAGE_KEY, short);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="flex">
        <FlagPick
          name="English"
          onClick={onPick("en")}
          className={classes.flag21}
          FlagSVG={ENFlag}
        />
        <FlagPick
          name="French"
          onClick={onPick("fr")}
          className={classes.flag32}
          FlagSVG={FRFlag}
        />
      </div>
    </Modal>
  );
};
