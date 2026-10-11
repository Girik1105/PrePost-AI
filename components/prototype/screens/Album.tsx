//created by kinjal
"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { BRAND } from "@/lib/brand";
import { SCENES } from "@/lib/scenes";
import { useProto } from "../PrototypeController";
import { APP, Brownie, Button, LargeTitle, ScreenBody, TabBar } from "../ui/kit";
import SceneArt from "../scenes/SceneArt";

export default function Album() {
  const { state, go, driven } = useProto();
  // The picnic was already safe, so it lives here from the start.
  const items = [...state.saved, ...(state.saved.includes("picnic") ? [] : (["picnic"] as const))];

  return (
    <>
      <ScreenBody tabbar>
        <LargeTitle title="Safe to Share" />
        <p className="-mt-1 px-5 pb-4 text-[15px] leading-snug text-[#6B6B73]">Ready when you are. These are safe to post.</p>

        {items.length <= 1 && state.saved.length === 0 ? (
          <div className="flex flex-col items-center px-8 pt-6 text-center">
            <Brownie pose="sleepy" size={150} />
            <p className="mt-4 text-[17px] font-semibold">Nothing to fix yet.</p>
            <p className="mt-1 text-[14px] leading-snug text-[#6B6B73]">When SafePost cleans up a photo, the safe version shows up here.</p>
            <div className="mt-5 w-full">
              <Button onClick={() => go("scan", { mode: "tab" })} hint={!driven}>
                Scan my photos
              </Button>
            </div>
            <div className="mt-6 grid w-full grid-cols-3 gap-[3px]">
              <AlbumTile id="picnic" edits={state.edits} onClick={() => go("detail", { scene: "picnic" })} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[3px] px-[3px]">
            {items.map((id, i) => (
              <motion.div key={id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                <AlbumTile id={id} edits={state.edits} onClick={() => go(id === "picnic" ? "detail" : "compare", { scene: id })} />
              </motion.div>
            ))}
          </div>
        )}
        {state.saved.length > 0 && (
          <div className="px-4 pt-6">
            <Button onClick={() => go("social")} variant="navy" hint={!driven}>
              Post it on {BRAND.socialApp}
            </Button>
          </div>
        )}
      </ScreenBody>
      <TabBar />
    </>
  );
}

function AlbumTile({ id, edits, onClick }: { id: keyof typeof SCENES; edits: Record<string, "none" | "blur" | "remove">; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="relative block aspect-square w-full overflow-hidden rounded-[4px]" aria-label={`${SCENES[id].title}, safe version`}>
      <SceneArt id={id} edits={edits} className="h-full w-full" />
      <span className="absolute bottom-[6px] right-[6px] flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-white shadow" style={{ background: APP.sage }}>
        <ShieldCheck className="h-[13px] w-[13px] text-white" weight="bold" aria-hidden />
      </span>
    </button>
  );
}
