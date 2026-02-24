import {
  BoxIcon,
  DiamondPlusIcon,
  HeartCrackIcon,
  HeartIcon,
  HexagonIcon,
  PickaxeIcon,
  ShieldIcon,
  SquarePenIcon,
  WindIcon,
} from "../../icons";

export interface Melody {
  id: string;
  localeId: string;
  icon: typeof SquarePenIcon;
  x: number;
  y: number;
  require?: string;
}

export const melodies: Melody[] = [];

const newMelody = (m: Melody): Melody => {
  melodies.push(m);
  return m;
};

export const WindMelody = newMelody({
  id: "WIND",
  localeId: "WIND",
  icon: WindIcon,
  x: -50,
  y: 100,
});

export const LaborMelody = newMelody({
  id: "LABOR",
  localeId: "LABOR",
  icon: PickaxeIcon,
  x: 50,
  y: 100,
});

export const VoidMelody = newMelody({
  id: "VOID",
  localeId: "VOID",
  icon: BoxIcon,
  x: 0,
  y: 0,
});

WindMelody.require = VoidMelody.id;
LaborMelody.require = WindMelody.id;
VoidMelody.require = LaborMelody.id;

export const HealthMelody = newMelody({
  id: "HEALTH",
  localeId: "HEALTH",
  icon: HeartIcon,
  x: -150,
  y: 0,
  require: WindMelody.id,
});

export const ExtraHealth1Melody = newMelody({
  id: "EXTRA_HEALTH_1",
  localeId: "EXTRA_HEALTH",
  icon: HeartIcon,
  x: -250,
  y: 0,
  require: HealthMelody.id,
});

export const ExtraHealth2Melody = newMelody({
  id: "EXTRA_HEALTH_2",
  localeId: "EXTRA_HEALTH",
  icon: HeartIcon,
  x: -350,
  y: 0,
  require: ExtraHealth1Melody.id,
});

export const ExtraHealth3Melody = newMelody({
  id: "EXTRA_HEALTH_3",
  localeId: "EXTRA_HEALTH",
  icon: HeartIcon,
  x: -450,
  y: 0,
  require: ExtraHealth2Melody.id,
});

export const ArmorMelody = newMelody({
  id: "ARMOR",
  localeId: "ARMOR",
  icon: ShieldIcon,
  x: -150,
  y: -100,
  require: HealthMelody.id,
});

export const ThickArmor1 = newMelody({
  id: "THICK_ARMOR_1",
  localeId: "THICK_ARMOR",
  icon: HexagonIcon,
  x: -250,
  y: -100,
  require: ArmorMelody.id,
});

export const ThickArmor2 = newMelody({
  id: "THICK_ARMOR_2",
  localeId: "THICK_ARMOR",
  icon: HexagonIcon,
  x: -350,
  y: -100,
  require: ThickArmor1.id,
});

export const ThickArmor3 = newMelody({
  id: "THICK_ARMOR_3",
  localeId: "THICK_ARMOR",
  icon: HexagonIcon,
  x: -450,
  y: -100,
  require: ThickArmor2.id,
});

export const ShellMelody = newMelody({
  id: "SHELL",
  localeId: "SHELL",
  icon: HexagonIcon,
  x: -150,
  y: -200,
  require: ArmorMelody.id,
});

export const ShellRecharge1 = newMelody({
  id: "SHELL_RECHARGE_1",
  localeId: "SHELL_RECHARGE",
  icon: HexagonIcon,
  x: -250,
  y: -200,
  require: ShellMelody.id,
});

export const ShellRecharge2 = newMelody({
  id: "SHELL_RECHARGE_2",
  localeId: "SHELL_RECHARGE",
  icon: HexagonIcon,
  x: -350,
  y: -200,
  require: ShellRecharge1.id,
});

export const ShellRecharge3 = newMelody({
  id: "SHELL_RECHARGE_3",
  localeId: "SHELL_RECHARGE",
  icon: HexagonIcon,
  x: -450,
  y: -200,
  require: ShellRecharge2.id,
});

export const Fatal = newMelody({
  id: "FATAL",
  localeId: "FATAL",
  icon: HeartCrackIcon,
  x: -150,
  y: -300,
  require: ShellMelody.id,
});

export const MoreRunes1 = newMelody({
  id: "MORE_RUNES_1",
  localeId: "MORE_RUNES",
  icon: DiamondPlusIcon,
  x: 0,
  y: -100,
  require: VoidMelody.id,
});

export const MoreRunes2 = newMelody({
  id: "MORE_RUNES_2",
  localeId: "MORE_RUNES",
  icon: DiamondPlusIcon,
  x: 0,
  y: -200,
  require: MoreRunes1.id,
});

export const MoreRunes3 = newMelody({
  id: "MORE_RUNES_3",
  localeId: "MORE_RUNES",
  icon: DiamondPlusIcon,
  x: 0,
  y: -300,
  require: MoreRunes2.id,
});
