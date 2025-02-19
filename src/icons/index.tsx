import Book from "./book.svg";
import Box from "./box.svg";
import Check from "./check.svg";
import Circle from "./circle.svg";
import Edit from "./edit.svg";
import Feather from "./feather.svg";
import File from "./file.svg";
import Heart from "./heart.svg";
import Hexagon from "./hexagon.svg";
import Italic from "./italic.svg";
import List from "./list.svg";
import Lock from "./lock.svg";
import Map from "./map.svg";
import Menu from "./menu.svg";
import Settings from "./settings.svg";
import Share from "./share.svg";
import Shield from "./shield.svg";
import Trash from "./trash.svg";
import X from "./x.svg";
import Zap from "./zap.svg";
import PlusSquare from "./plus-square.svg";
import Plus from "./plus.svg";
import Minus from "./minus.svg";

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
export const TrashIcon = makeIcon(Trash);
export const BookIcon = makeIcon(Book);
export const MenuIcon = makeIcon(Menu);
export const ItalicIcon = makeIcon(Italic);
export const CheckIcon = makeIcon(Check);
export const ShareIcon = makeIcon(Share);
export const ZapIcon = makeIcon(Zap);
export const ShieldIcon = makeIcon(Shield);
export const SettingsIcon = makeIcon(Settings);
export const HeartIcon = makeIcon(Heart);
export const FeatherIcon = makeIcon(Feather);
export const BoxIcon = makeIcon(Box);
export const HexagonIcon = makeIcon(Hexagon);
export const LockIcon = makeIcon(Lock);
export const PlusSquareIcon = makeIcon(PlusSquare);
export const PlusIcon = makeIcon(Plus);
export const MinusIcon = makeIcon(Minus);
