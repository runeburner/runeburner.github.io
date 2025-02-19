import { useRef } from "react";
import classes from "./Modal.module.css";

export type ModalProps = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

export const Modal = ({ open, onClose, children }: ModalProps) => {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      onClick={onBackdropClick}
      className={classes.backdrop + (!open ? " " + classes.hidden : "")}
      ref={backdropRef}
    >
      <div className={classes.container}>{children}</div>
    </div>
  );
};
