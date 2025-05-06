import Book from "./book.svg";
import Box from "./box.svg";
import Check from "./check.svg";
import Circle from "./circle.svg";
import Edit from "./edit.svg";
import File from "./file.svg";
import Heart from "./heart.svg";
import Help from "./help-circle.svg";
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
import Aido from "./aido.svg";
import Algiz from "./algiz.svg";
import Ansuz from "./ansuz.svg";
import Berkanan from "./berkanan.svg";
import Dagaz from "./dagaz.svg";
import Ehwaz from "./ehwaz.svg";
import Fehu from "./fehu.svg";
import Gebo from "./gebo.svg";
import Haglaz from "./haglaz.svg";
import Hurisaz from "./hurisaz.svg";
import Ingwaz from "./ingwaz.svg";
import Isaz from "./isaz.svg";
import Iwaz from "./iwaz.svg";
import Jeran from "./jeran.svg";
import Kauna from "./kauna.svg";
import Laukaz from "./laukaz.svg";
import Mannaz from "./mannaz.svg";
import Naudiz from "./naudiz.svg";
import Othalan from "./othalan.svg";
import Pertho from "./pertho.svg";
import Sowilo from "./sowilo.svg";
import Tiwaz from "./tiwaz.svg";
import Uruz from "./uruz.svg";
import Wunjo from "./wunjo.svg";
import Magic from "./magic.svg";
import Feather from "./feather.svg";

type HTMLDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const makeIcon =
  (Icon: string) =>
  (props: HTMLDivProps): React.ReactElement => {
    return (
      <div {...props}>
        <Icon />
      </div>
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
export const HelpIcon = makeIcon(Help);

export const AidoIcon = makeIcon(Aido);
export const AlgizIcon = makeIcon(Algiz);
export const AnsuzIcon = makeIcon(Ansuz);
export const BerkananIcon = makeIcon(Berkanan);
export const DagazIcon = makeIcon(Dagaz);
export const EhwazIcon = makeIcon(Ehwaz);
export const FehuIcon = makeIcon(Fehu);
export const GeboIcon = makeIcon(Gebo);
export const HaglazIcon = makeIcon(Haglaz);
export const HurisazIcon = makeIcon(Hurisaz);
export const IngwazIcon = makeIcon(Ingwaz);
export const IsazIcon = makeIcon(Isaz);
export const IwazIcon = makeIcon(Iwaz);
export const JeranIcon = makeIcon(Jeran);
export const KaunaIcon = makeIcon(Kauna);
export const LaukazIcon = makeIcon(Laukaz);
export const MannazIcon = makeIcon(Mannaz);
export const NaudizIcon = makeIcon(Naudiz);
export const OthalanIcon = makeIcon(Othalan);
export const PerthoIcon = makeIcon(Pertho);
export const SowiloIcon = makeIcon(Sowilo);
export const TiwazIcon = makeIcon(Tiwaz);
export const UruzIcon = makeIcon(Uruz);
export const WunjoIcon = makeIcon(Wunjo);
export const MagicIcon = makeIcon(Magic);
