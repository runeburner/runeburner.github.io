import { useState } from "react";
import { EditIcon } from "../../icons";
import { Modal } from "../../Modal/Modal";
import classes from "./Node.module.css";
interface NodeProps {
  icon: typeof EditIcon;
  x: number;
  y: number;
  title: string;
  lvl: [number, number];
  description: string;
}

export const Node = (props: NodeProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const { x, y } = props;
  const { title, description } = props;
  const { lvl } = props;
  const { icon: Icon } = props;

  const onClose = () => {
    setOpen(false);
    console.log("onclose");
  };
  console.log(open);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={classes.node}
        style={{ left: x, top: y }}
      >
        <Icon style={{ width: "100%", height: "100%" }} />
      </div>

      <Modal open={open} onClose={onClose}>
        <h1>
          {title} {lvl[0]}/{lvl[1]}
        </h1>
        <p>{description}</p>
      </Modal>
    </>
  );
};
