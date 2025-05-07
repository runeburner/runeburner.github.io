import gameLoopEN from "./manual/en/gameLoop.md?raw";
import gameLoopFR from "./manual/fr/gameLoop.md?raw";
import attunementEN from "./manual/en/attunement.md?raw";
import attunementFR from "./manual/fr/attunement.md?raw";
import editorEN from "./manual/en/editor.md?raw";
import editorFR from "./manual/fr/editor.md?raw";
import worldEN from "./manual/en/world.md?raw";
import worldFR from "./manual/fr/world.md?raw";
import perksEN from "./manual/en/perks.md?raw";
import perksFR from "./manual/fr/perks.md?raw";
import helpEN from "./manual/en/help.md?raw";
import helpFR from "./manual/fr/help.md?raw";
import settingsEN from "./manual/en/settings.md?raw";
import settingsFR from "./manual/fr/settings.md?raw";
import MOVE_NEXT_TOEN from "./manual/en/MOVE_NEXT_TO.md?raw";
import MOVE_NEXT_TOFR from "./manual/fr/MOVE_NEXT_TO.md?raw";
import MINEEN from "./manual/en/MINE.md?raw";
import MINEFR from "./manual/fr/MINE.md?raw";
import ATTUNEEN from "./manual/en/ATTUNE.md?raw";
import ATTUNEFR from "./manual/fr/ATTUNE.md?raw";
import DIEEN from "./manual/en/DIE.md?raw";
import DIEFR from "./manual/fr/DIE.md?raw";
import SMASHEN from "./manual/en/SMASH.md?raw";
import SMASHFR from "./manual/fr/SMASH.md?raw";
import IDLEEN from "./manual/en/IDLE.md?raw";
import IDLEFR from "./manual/fr/IDLE.md?raw";
import WindRuneEN from "./manual/en/WindRune.md?raw";
import WindRuneFR from "./manual/fr/WindRune.md?raw";
import VoidRuneEN from "./manual/en/VoidRune.md?raw";
import VoidRuneFR from "./manual/fr/VoidRune.md?raw";
import LaborRuneEN from "./manual/en/LaborRune.md?raw";
import LaborRuneFR from "./manual/fr/LaborRune.md?raw";
import golemEN from "./manual/en/golem.md?raw";
import golemFR from "./manual/fr/golem.md?raw";
import heartEN from "./manual/en/heart.md?raw";
import heartFR from "./manual/fr/heart.md?raw";
import dummyEN from "./manual/en/dummy.md?raw";
import dummyFR from "./manual/fr/dummy.md?raw";
import rune_crystalsEN from "./manual/en/rune_crystals.md?raw";
import rune_crystalsFR from "./manual/fr/rune_crystals.md?raw";
import rocksEN from "./manual/en/rocks.md?raw";
import rocksFR from "./manual/fr/rocks.md?raw";
import emptyEN from "./manual/en/empty.md?raw";
import emptyFR from "./manual/fr/empty.md?raw";
import incantationsEN from "./manual/en/incantations.md?raw";
import incantationsFR from "./manual/fr/incantations.md?raw";

export const Content = {
  en: {
    gameLoop: gameLoopEN,
    attunement: attunementEN,
    editor: editorEN,
    world: worldEN,
    perks: perksEN,
    help: helpEN,
    settings: settingsEN,
    MOVE_NEXT_TO: MOVE_NEXT_TOEN,
    MINE: MINEEN,
    ATTUNE: ATTUNEEN,
    DIE: DIEEN,
    SMASH: SMASHEN,
    IDLE: IDLEEN,
    WindRune: WindRuneEN,
    VoidRune: VoidRuneEN,
    LaborRune: LaborRuneEN,
    golem: golemEN,
    heart: heartEN,
    dummy: dummyEN,
    rune_crystals: rune_crystalsEN,
    rocks: rocksEN,
    empty: emptyEN,
    incantations: incantationsEN,
  },
  fr: {
    gameLoop: gameLoopFR,
    attunement: attunementFR,
    editor: editorFR,
    world: worldFR,
    perks: perksFR,
    help: helpFR,
    settings: settingsFR,
    MOVE_NEXT_TO: MOVE_NEXT_TOFR,
    MINE: MINEFR,
    ATTUNE: ATTUNEFR,
    DIE: DIEFR,
    SMASH: SMASHFR,
    IDLE: IDLEFR,
    WindRune: WindRuneFR,
    VoidRune: VoidRuneFR,
    LaborRune: LaborRuneFR,
    golem: golemFR,
    heart: heartFR,
    dummy: dummyFR,
    rune_crystals: rune_crystalsFR,
    rocks: rocksFR,
    empty: emptyFR,
    incantations: incantationsFR,
  },
} as Record<string, Record<string, string>>;
