import gameLoopEN from "./manual/en/gameLoop.md?raw";
import gameLoopFR from "./manual/fr/gameLoop.md?raw";
import musicalNotesEN from "./manual/en/musicalNotes.md?raw";
import musicalNotesFR from "./manual/fr/musicalNotes.md?raw";
import editorEN from "./manual/en/editor.md?raw";
import editorFR from "./manual/fr/editor.md?raw";
import worldEN from "./manual/en/world.md?raw";
import worldFR from "./manual/fr/world.md?raw";
import melodyEN from "./manual/en/melody.md?raw";
import melodyFR from "./manual/fr/melody.md?raw";
import yggdrasilEN from "./manual/en/yggdrasil.md?raw";
import yggdrasilFR from "./manual/fr/yggdrasil.md?raw";
import helpEN from "./manual/en/help.md?raw";
import helpFR from "./manual/fr/help.md?raw";
import settingsEN from "./manual/en/settings.md?raw";
import settingsFR from "./manual/fr/settings.md?raw";
import MOVE_NEXT_TOEN from "./manual/en/MOVE_NEXT_TO.md?raw";
import MOVE_NEXT_TOFR from "./manual/fr/MOVE_NEXT_TO.md?raw";
import MINEEN from "./manual/en/MINE.md?raw";
import MINEFR from "./manual/fr/MINE.md?raw";
import SINGEN from "./manual/en/SING.md?raw";
import SINGFR from "./manual/fr/SING.md?raw";
import FADEEN from "./manual/en/FADE.md?raw";
import FADEFR from "./manual/fr/FADE.md?raw";
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
    musicalNotes: musicalNotesEN,
    editor: editorEN,
    world: worldEN,
    melody: melodyEN,
    help: helpEN,
    settings: settingsEN,
    MOVE_NEXT_TO: MOVE_NEXT_TOEN,
    MINE: MINEEN,
    SING: SINGEN,
    FADE: FADEEN,
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
    yggdrasil: yggdrasilEN,
  },
  fr: {
    gameLoop: gameLoopFR,
    musicalNotes: musicalNotesFR,
    editor: editorFR,
    world: worldFR,
    melody: melodyFR,
    help: helpFR,
    settings: settingsFR,
    MOVE_NEXT_TO: MOVE_NEXT_TOFR,
    MINE: MINEFR,
    SING: SINGFR,
    FADE: FADEFR,
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
    yggdrasil: yggdrasilFR,
  },
} as Record<string, Record<string, string>>;
