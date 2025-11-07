import {
  BoxIcon,
  HeartIcon,
  HexagonIcon,
  PickaxeIcon,
  ShieldIcon,
  SquarePenIcon,
  WindIcon,
} from "../../icons";

export interface Melody {
  id: string;
  icon: typeof SquarePenIcon;
  x: number;
  y: number;
  require?: string;
}

export const WindMelody: Melody = {
  id: "WIND",
  icon: WindIcon,
  x: -50,
  y: 100,
};

export const LaborMelody: Melody = {
  id: "LABOR",
  icon: PickaxeIcon,
  x: 50,
  y: 100,
};

export const VoidMelody: Melody = {
  id: "VOID",
  icon: BoxIcon,
  x: 0,
  y: 0,
};

WindMelody.require = VoidMelody.id;
LaborMelody.require = WindMelody.id;
VoidMelody.require = LaborMelody.id;

export const HealthMelody: Melody = {
  id: "HEALTH",
  icon: HeartIcon,
  x: -150,
  y: 0,
  require: WindMelody.id,
};

export const ExtraHealth1Melody: Melody = {
  id: "EXTRA_HEALTH_1",
  icon: HeartIcon,
  x: -250,
  y: 0,
  require: HealthMelody.id,
};

export const ArmorMelody: Melody = {
  id: "ARMOR",
  icon: ShieldIcon,
  x: -150,
  y: -100,
  require: HealthMelody.id,
};

export const ShieldMelody: Melody = {
  id: "SHELL",
  icon: HexagonIcon,
  x: -250,
  y: -150,
  require: ArmorMelody.id,
};

export const melodies: Melody[] = [
  WindMelody,
  LaborMelody,
  VoidMelody,
  HealthMelody,
  ExtraHealth1Melody,
  ArmorMelody,
  ShieldMelody,
];
