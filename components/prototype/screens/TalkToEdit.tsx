//created by kinjal
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Microphone as Mic, ArrowUUpLeft as Undo2 } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useRef, useState } from "react";
import { SCENES, VIEWBOX, type ObjMode } from "@/lib/scenes";
import { SUGGESTIONS, isLocationCommand, parseCommand } from "@/lib/editCommands";
import { useProto } from "../PrototypeController";
import { APP, NavBar } from "../ui/kit";
import SceneArt from "../scenes/SceneArt";

interface Msg {
  id: number;
  from: "me" | "app";
  text: string;
  chips?: boolean;
}

let msgId = 0;

export default function TalkToEdit() {
  const { state, setEdit, strip, go, driven, touch } = useProto();
  const reduce = useReducedMotion();
  const scene = SCENES[state.scene];
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [finding, setFinding] = useState<{ id: string; label: string } | null>(null);
  const [history, setHistory] = useState<{ id: string; prev: ObjMode }[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: ++msgId, from: "app", text: "Tell me what to hide. I'll find it in the photo." }]);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [msgs, finding, reduce]);

  const say = (from: Msg["from"], text: string, chips = false) => setMsgs((m) => [...m, { id: ++msgId, from, text, chips }]);

  const run = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setDraft("");
      say("me", text);
      if (isLocationCommand(text)) {
        later(500, () => {
          strip(scene.id, true);
          say("app", "Done. I removed the location, device and time from the photo file.");
        });
        return;
      }
      const cmd = parseCommand(text, scene.id);
      if (!cmd) {
        later(500, () => say("app", "I couldn't find that in this photo. Try one of these.", true));
        return;
      }
      setFinding({ id: cmd.targetId, label: cmd.targetLabel });
      later(1300, () => {
        setFinding(null);
        setHistory((h) => [...h, { id: cmd.targetId, prev: state.edits[cmd.targetId] ?? "none" }]);
        setEdit(cmd.targetId, cmd.action);
        say("app", `Done. I ${cmd.action === "remove" ? "removed" : "blurred"} the ${cmd.targetLabel}.`);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene.id, state.edits, setEdit, strip],
  );

  // demo cue: type a command letter by letter, then send it
  useEffect(() => {
    const c = state.cue;
    if (c?.name !== "type" || !c.arg) return;
    const text = c.arg;
    let i = 0;
    const start = window.setTimeout(function tick() {
      i++;
      setDraft(text.slice(0, i));
      if (i < text.length) timers.current.push(window.setTimeout(tick, 70));
      else timers.current.push(window.setTimeout(() => run(text), 600));
    }, 1400);
    timers.current.push(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cue]);

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setEdit(last.id, last.prev);
    say("app", "Undone. It's back the way it was.");
  };

  const mic = () => {
    touch();
    setListening(true);
    const pick = SUGGESTIONS[scene.id].find((s) => {
      const c = parseCommand(s, scene.id);
      return c && (state.edits[c.targetId] ?? "none") === "none";
    }) ?? SUGGESTIONS[scene.id][0];
    later(1800, () => {
      setListening(false);
      setDraft(pick ?? "");
    });
  };

  const target = finding ? scene.detections.find((d) => d.id === finding.id)?.box : undefined;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#15172A] pt-[54px] text-white">
      <NavBar
        title="Edit with words"
        tone="light"
        right={
          <>
            <button type="button" onClick={undo} disabled={!history.length} aria-label="Undo" className="rounded-lg p-1 text-white disabled:opacity-30">
              <Undo2 className="h-[22px] w-[22px]" aria-hidden />
            </button>
            <button type="button" onClick={() => go("compare")} className={`rounded-full bg-[#E8846B] px-3 py-[5px] text-[15px] font-semibold text-[#1E2440] ${history.length && !driven ? "tap-hint" : ""}`}>
              Done
            </button>
          </>
        }
      />

      <div className="relative mx-3 mt-1 aspect-[4/3] overflow-hidden rounded-[18px]">
        <SceneArt id={scene.id} edits={state.edits} className="h-full w-full" />
        <AnimatePresence>
          {target && (
            <motion.div
              className="absolute rounded-[10px] border-[2.5px] border-white"
              style={{
                left: `${(target.x / VIEWBOX.w) * 100}%`,
                top: `${(target.y / VIEWBOX.h) * 100}%`,
                width: `${(target.w / VIEWBOX.w) * 100}%`,
                height: `${(target.h / VIEWBOX.h) * 100}%`,
                boxShadow: "0 0 0 4px rgba(232,132,107,0.55)",
              }}
              initial={{ opacity: 0, scale: 1.3 }}
              animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { repeat: Infinity, duration: 0.9 }, scale: { duration: 0.3 } }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* conversation */}
      <div ref={logRef} className="no-scrollbar mt-3 flex-1 space-y-2 overflow-y-auto px-4" aria-live="polite">
        {msgs.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-[18px] px-[14px] py-[9px] text-[15px] leading-snug ${m.from === "me" ? "rounded-br-[6px] bg-[#8F80C2] text-white" : "rounded-bl-[6px] bg-white/10 text-white/90"}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {finding && (
          <div className="flex justify-start">
            <div className="shimmer relative overflow-hidden rounded-[18px] rounded-bl-[6px] bg-white/10 px-[14px] py-[9px] text-[15px] text-white/80">
              Finding the {finding.label}...
            </div>
          </div>
        )}
      </div>

      {/* suggestion chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2 pt-2">
        {SUGGESTIONS[scene.id].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              touch();
              run(s);
            }}
            className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-[7px] text-[13px] font-medium text-white/90"
          >
            {s}
          </button>
        ))}
      </div>

      {/* composer */}
      <form
        className="mx-3 flex items-center gap-2 rounded-full bg-white/10 py-[6px] pl-4 pr-[6px]"
        onSubmit={(e) => {
          e.preventDefault();
          touch();
          run(draft);
        }}
      >
        {listening ? (
          <div className="flex h-[36px] flex-1 items-center gap-[3px]" aria-label="Listening">
            {[...Array(22)].map((_, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-[#E8846B]"
                animate={{ height: [6, 8 + ((i * 7) % 20), 6] }}
                transition={{ repeat: Infinity, duration: 0.6 + (i % 5) * 0.08, delay: i * 0.03 }}
              />
            ))}
            <span className="ml-2 text-[13px] text-white/60">Listening...</span>
          </div>
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Try: blur the street sign"
            aria-label="Tell PrePost what to hide"
            className="h-[36px] min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
          />
        )}
        <button type="button" onClick={mic} aria-label="Speak a command" className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-white/90">
          <Mic className="h-5 w-5" aria-hidden />
        </button>
        <button type="submit" aria-label="Send" className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-[#1E2440]" style={{ background: draft ? APP.coral : "rgba(255,255,255,0.25)" }}>
          <ArrowUp className="h-5 w-5" weight="bold" aria-hidden />
        </button>
      </form>
      <p className="px-6 pb-[30px] pt-2 text-center text-[11px] leading-snug text-white/50">
        PrePost edits objects and text only. It never changes faces or bodies.
      </p>
    </div>
  );
}
