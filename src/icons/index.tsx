import Circle from "./circle.svg";
import Edit from "./edit.svg";
import File from "./file.svg";
import List from "./list.svg";
import Map from "./map.svg";
import X from "./x.svg";

type HTMLSpanProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

const makeIcon = (Icon: string) => (props: HTMLSpanProps) => {
  return (
    <span {...props}>
      <Icon />
    </span>
  );
};

export const CircleIcon = makeIcon(Circle);
export const EditIcon = makeIcon(Edit);
export const FileIcon = makeIcon(File);
export const ListIcon = makeIcon(List);
export const MapIcon = makeIcon(Map);
export const XIcon = makeIcon(X);
