//created by kinjal
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SCENES, type ObjMode, type SceneId } from "@/lib/scenes";

export type ScreenId =
  | "welcome"
  | "access"
  | "kids"
  | "lock"
  | "home"
  | "scan"
  | "detail"
  | "edit"
  | "compare"
  | "album"
  | "social"
  | "insights"
  | "settings";

export const TAB_SCREENS: ScreenId[] = ["home", "scan", "album", "insights", "settings"];

export interface Cue {
  name: string;
  arg?: string;
  key: number;
}

export interface ProtoState {
  screen: ScreenId;
  dir: 1 | -1 | 0;
  stack: ScreenId[];
  scene: SceneId;
  edits: Record<string, ObjMode>;
  stripped: Partial<Record<SceneId, boolean>>;
  saved: SceneId[];
  scanned: boolean;
  notif: boolean;
  access: "selected" | "all" | null;
  kids: string[];
  settings: Record<string, boolean>;
  cue: Cue | null;
}

export const INITIAL: ProtoState = {
  screen: "welcome",
  dir: 0,
  stack: [],
  scene: "school",
  edits: {},
  stripped: {},
  saved: [],
  scanned: false,
  notif: true,
  access: null,
  kids: ["Maya", "Leo"],
  settings: { faces: true, location: true, ondevice: false, names: true, notifications: true },
  cue: null,
};

type GoMode = "push" | "tab" | "replace";

interface Api {
  state: ProtoState;
  go: (screen: ScreenId, opts?: { scene?: SceneId; mode?: GoMode }) => void;
  back: () => void;
  setEdit: (id: string, mode: ObjMode) => void;
  fixAll: (scene: SceneId) => void;
  strip: (scene: SceneId, on?: boolean) => void;
  save: (scene: SceneId) => void;
  patch: (p: Partial<ProtoState>) => void;
  /** guided demo */
  demo: DemoApi;
  /** true while the guided demo drives the phone */
  driven: boolean;
  /** user touched the phone: pause the guided demo so they can explore */
  touch: () => void;
  /** back to the very first screen, demo off */
  reset: () => void;
}

export interface DemoStep {
  caption: string;
  detail: string;
  duration: number;
  setup: (s: ProtoState) => Partial<ProtoState>;
  run?: (api: Pick<Api, "fixAll" | "strip" | "setEdit" | "patch">, at: (ms: number, fn: () => void) => void) => void;
}

interface DemoApi {
  active: boolean;
  playing: boolean;
  step: number;
  steps: DemoStep[];
  start: () => void;
  stop: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  goto: (i: number) => void;
}

let cueCounter = 0;
const cue = (name: string, arg?: string): Cue => ({ name, arg, key: ++cueCounter });

function fixedEdits(scene: SceneId, base: Record<string, ObjMode>): Record<string, ObjMode> {
  const next = { ...base };
  for (const d of SCENES[scene].detections) {
    if (d.fix !== "strip" && (next[d.id] ?? "none") === "none") next[d.id] = d.fix === "remove" ? "remove" : "blur";
  }
  return next;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    caption: "Mom takes three photos at school pickup.",
    detail: "A few minutes later, PrePost has already checked them on her phone.",
    duration: 9000,
    setup: () => ({ screen: "lock", notif: false }),
    run: (api, at) => at(1200, () => api.patch({ notif: true })),
  },
  {
    caption: "PrePost finds what the photo gives away.",
    detail: "The school sign, the crest on her shirt, the name tag, and the location hidden in the file.",
    duration: 13000,
    setup: () => ({ screen: "detail", scene: "school", cue: cue("reveal") }),
  },
  {
    caption: "It explains why, in human terms.",
    detail: "No jargon and no scolding. One question to sit with before posting.",
    duration: 13000,
    setup: () => ({ screen: "detail", scene: "school", cue: cue("why") }),
  },
  {
    caption: "One tap fixes it.",
    detail: "Everything risky gets a soft blur and the location is stripped. The moment stays.",
    duration: 11000,
    setup: () => ({ screen: "detail", scene: "school", cue: cue("top") }),
    run: (api, at) =>
      at(1600, () => {
        api.fixAll("school");
        api.strip("school", true);
      }),
  },
  {
    caption: "Or just say what to hide.",
    detail: "Talk to edit. Type or say it, and PrePost finds the object and hides it.",
    duration: 15000,
    setup: () => ({ screen: "edit", scene: "porch", cue: cue("type", "remove the house number") }),
  },
  {
    caption: "Same moment. None of the risk.",
    detail: "House number, street sign, mailbox and plate are gone. Location, device and time are stripped.",
    duration: 11000,
    setup: (s) => ({
      screen: "compare",
      scene: "porch",
      edits: { ...fixedEdits("porch", s.edits), "porch-number": "remove" },
      stripped: { ...s.stripped, porch: true },
      cue: cue("sweep"),
    }),
  },
  {
    caption: "It's ready before you even open the app.",
    detail: "Open your social app and PrePost gently reminds you which version is safe.",
    duration: 12000,
    setup: (s) => ({
      screen: "social",
      edits: { ...fixedEdits("school", fixedEdits("porch", s.edits)), "porch-number": "remove" },
      stripped: { school: true, porch: true },
      saved: ["school", "porch"],
      cue: cue("banner"),
    }),
  },
  {
    caption: "Built for parents. Works for everyone.",
    detail: "A card number and a boarding pass on a coffee table. Caught and blurred before anyone sees.",
    duration: 13000,
    setup: () => ({ screen: "detail", scene: "coffee", cue: cue("reveal") }),
    run: (api, at) => at(3800, () => api.fixAll("coffee")),
  },
];

const Ctx = createContext<Api | null>(null);

export function useProto(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProto outside ProtoProvider");
  return v;
}

export function ProtoProvider({ children, initial }: { children: React.ReactNode; initial?: Partial<ProtoState> }) {
  const [state, setState] = useState<ProtoState>(() => ({ ...INITIAL, ...initial }));
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const patch = useCallback((p: Partial<ProtoState>) => setState((s) => ({ ...s, ...p })), []);

  const go = useCallback<Api["go"]>((screen, opts = {}) => {
    const mode = opts.mode ?? (TAB_SCREENS.includes(screen) ? "tab" : "push");
    setState((s) => ({
      ...s,
      screen,
      scene: opts.scene ?? s.scene,
      dir: mode === "push" ? 1 : 0,
      stack: mode === "push" ? [...s.stack, s.screen] : mode === "tab" ? [] : s.stack,
      cue: null,
    }));
  }, []);

  const back = useCallback(() => {
    setState((s) => {
      const stack = [...s.stack];
      const prev = stack.pop() ?? "home";
      return { ...s, screen: prev, stack, dir: -1, cue: null };
    });
  }, []);

  const setEdit = useCallback((id: string, mode: ObjMode) => {
    setState((s) => ({ ...s, edits: { ...s.edits, [id]: mode } }));
  }, []);

  const fixAll = useCallback((scene: SceneId) => {
    setState((s) => ({ ...s, edits: fixedEdits(scene, s.edits) }));
  }, []);

  const strip = useCallback((scene: SceneId, on = true) => {
    setState((s) => ({ ...s, stripped: { ...s.stripped, [scene]: on } }));
  }, []);

  const save = useCallback((scene: SceneId) => {
    setState((s) => (s.saved.includes(scene) ? s : { ...s, saved: [scene, ...s.saved] }));
  }, []);

  // ---- guided demo ----
  const enterStep = useCallback(
    (i: number) => {
      clearTimers();
      const def = DEMO_STEPS[i];
      // Every step builds from a clean slate so Previous and Restart are deterministic.
      const base: ProtoState = { ...INITIAL, scanned: true, access: "all" };
      setState({ ...base, dir: 0, ...def.setup(base) });
      setStep(i);
      if (def.run) {
        const at = (ms: number, fn: () => void) => {
          timers.current.push(window.setTimeout(fn, ms));
        };
        def.run({ fixAll, strip, setEdit, patch }, at);
      }
    },
    [fixAll, strip, setEdit, patch],
  );

  const start = useCallback(() => {
    setActive(true);
    setPlaying(true);
    enterStep(0);
  }, [enterStep]);

  const stop = useCallback(() => {
    clearTimers();
    setActive(false);
    setPlaying(false);
  }, []);

  const next = useCallback(() => {
    if (!active) return start();
    if (step < DEMO_STEPS.length - 1) enterStep(step + 1);
    else setPlaying(false);
  }, [active, step, enterStep, start]);

  const prev = useCallback(() => {
    if (!active) return start();
    enterStep(Math.max(0, step - 1));
  }, [active, step, enterStep, start]);

  const restart = useCallback(() => {
    setActive(true);
    setPlaying(true);
    enterStep(0);
  }, [enterStep]);

  const toggle = useCallback(() => {
    if (!active) return start();
    setPlaying((p) => !p);
  }, [active, start]);

  const gotoStep = useCallback(
    (i: number) => {
      setActive(true);
      enterStep(i);
    },
    [enterStep],
  );

  // auto-advance
  useEffect(() => {
    if (!active || !playing) return;
    const t = window.setTimeout(() => {
      if (step < DEMO_STEPS.length - 1) enterStep(step + 1);
      else setPlaying(false);
    }, DEMO_STEPS[step].duration);
    return () => window.clearTimeout(t);
  }, [active, playing, step, enterStep]);

  useEffect(() => () => clearTimers(), []);

  const reset = useCallback(() => {
    clearTimers();
    setActive(false);
    setPlaying(false);
    setStep(0);
    setState({ ...INITIAL, ...initial });
  }, [initial]);

  const touch = useCallback(() => {
    if (active && playing) setPlaying(false);
  }, [active, playing]);

  const demo: DemoApi = useMemo(
    () => ({ active, playing, step, steps: DEMO_STEPS, start, stop, toggle, next, prev, restart, goto: gotoStep }),
    [active, playing, step, start, stop, toggle, next, prev, restart, gotoStep],
  );

  const api: Api = useMemo(
    () => ({ state, go, back, setEdit, fixAll, strip, save, patch, demo, driven: active && playing, touch, reset }),
    [state, go, back, setEdit, fixAll, strip, save, patch, demo, active, playing, touch, reset],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
