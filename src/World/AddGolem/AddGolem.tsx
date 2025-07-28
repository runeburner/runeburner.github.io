import { useState } from "react";
import { AddGolemModal } from "../AddGolemModal/AddGolemModal";
import { useTranslation } from "react-i18next";

export const AddGolem = (): React.ReactElement => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const onClick = (): void => setOpen(true);
  return (
    <>
      <button className="btn" onClick={onClick}>
        {t("create_golem_modal.animate")}
      </button>
      {open && <AddGolemModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
