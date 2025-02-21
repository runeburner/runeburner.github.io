import { useState } from "react";
import { EditIcon, LockIcon } from "../../icons";
import { Modal } from "../../Modal/Modal";
import classes from "./Node.module.css";
import { NodeStatus } from "./NodeStatus";

const statusContainerClasses: Record<string, string> = {
  PURCHASED: classes.purchasedContainer,
  AVAILABLE: classes.availableContainer,
  UNLOCKED: classes.unlockedContainer,
  LOCKED: classes.lockedContainer,
};

const statusIconClasses: Record<string, string> = {
  PURCHASED: classes.purchasedIcon,
  AVAILABLE: classes.availableIcon,
  UNLOCKED: classes.unlockedIcon,
  LOCKED: classes.lockedIcon,
};

type NodeProps = {
  icon: typeof EditIcon;
  x: number;
  y: number;
  title: string;
  lvl: [number, number];
  description: string;
  status: NodeStatus;
};

export const Node = (props: NodeProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const { x, y } = props;
  const { title, description } = props;
  const { lvl } = props;
  const { icon } = props;
  const { status } = props;

  const Icon = status !== NodeStatus.LOCKED ? icon : LockIcon;
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={classes.node + " " + statusContainerClasses[status]}
        style={{ left: x, top: y }}
      >
        <Icon className={statusIconClasses[status]} />
      </div>

      {open && (
        <Modal open={true} onClose={() => setOpen(false)}>
          <h1>
            {title} {lvl[0]}/{lvl[1]}
          </h1>
          <p>{description}</p>
        </Modal>
      )}
    </>
  );
};
