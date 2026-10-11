//created by kinjal
"use client";

import { useId } from "react";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { SCENES, VIEWBOX, type ObjMode, type SceneId } from "@/lib/scenes";
import { Adult, Kid, SceneContext, Sensitive } from "./Sensitive";

/* ---------- Scenes. Picture-book flat style, every sensitive object is a <Sensitive>. ---------- */

function School() {
  return (
    <>
      <rect width={400} height={300} fill="#CFE5EC" />
      <circle cx={60} cy={46} r={20} fill="#FBE3A6" />
      {/* building */}
      <path d="M140 74 L265 26 L390 74Z" fill="#B5543F" />
      <rect x={150} y={70} width={232} height={154} fill="#EBCDA8" />
      <rect x={150} y={70} width={232} height={8} fill="#D9B48A" />
      {[168, 214, 316, 352].map((x) => (
        <g key={x}>
          <rect x={x} y={134} width={26} height={30} rx={3} fill="#9FC6D6" />
          <rect x={x} y={148} width={26} height={2} fill="#EBCDA8" />
        </g>
      ))}
      <rect x={252} y={160} width={46} height={64} rx={4} fill="#7A4E3A" />
      <circle cx={290} cy={194} r={2.5} fill="#F2D27A" />
      {/* flagpole */}
      <rect x={378} y={30} width={3} height={60} fill="#8A8F9C" />
      <path d="M381 32 L398 38 L381 44Z" fill="#8F80C2" />
      <Sensitive id="school-sign">
        <rect x={172} y={86} width={188} height={30} rx={6} fill="#2B3A67" />
        <text x={266} y={106} textAnchor="middle" fontSize={12} fontWeight={700} fill="#FFF7EC" fontFamily="system-ui, sans-serif" textLength={170} lengthAdjust="spacingAndGlyphs">
          LINCOLN OAKS ELEMENTARY
        </text>
      </Sensitive>
      {/* ground */}
      <rect y={220} width={400} height={80} fill="#BFD9A6" />
      <rect y={222} width={400} height={20} fill="#D8D3C7" />
      {/* tree */}
      <rect x={24} y={130} width={12} height={94} fill="#8B5E3C" />
      <circle cx={30} cy={118} r={30} fill="#7FA88B" />
      <circle cx={12} cy={136} r={18} fill="#6F9E7D" />
      {/* kid with crest */}
      <Kid x={95} y={112} s={1.2} shirt="#F3F0E8" pants="#2B3A67">
        <rect x={-19} y={52} width={38} height={6} fill="#2B3A67" opacity={0.15} />
      </Kid>
      <Sensitive id="school-crest">
        <path d="M83 172 H104.6 V184 Q104.6 193.6 93.8 197.2 Q83 193.6 83 184Z" fill="#B5543F" />
        <path d="M88 178 H99.6 M88 184 H99.6" stroke="#FBE3A6" strokeWidth={2} />
      </Sensitive>
      {/* backpack */}
      <rect x={112} y={156} width={52} height={66} rx={14} fill="#8F80C2" />
      <rect x={116} y={204} width={44} height={14} rx={5} fill="#7A6BB0" />
      <path d="M118 156 Q138 136 158 156" stroke="#6B5CA5" strokeWidth={5} fill="none" />
      <Sensitive id="school-tag">
        <rect x={120} y={185} width={42} height={19} rx={4} fill="#FFFBF2" stroke="#2B3A67" strokeWidth={1} />
        <text x={141} y={198} textAnchor="middle" fontSize={9.5} fontWeight={800} fill="#2B3A67" fontFamily="system-ui, sans-serif">
          MAYA J.
        </text>
      </Sensitive>
    </>
  );
}

function Birthday() {
  const letters = ["M", "A", "Y", "", "1", "4"];
  return (
    <>
      <rect width={400} height={300} fill="#F7E3D4" />
      {[...Array(9)].map((_, i) => (
        <circle key={i} cx={20 + i * 46} cy={80 + (i % 2) * 30} r={3} fill="#E8846B" opacity={0.35} />
      ))}
      {/* balloons */}
      <path d="M48 150 Q52 190 44 230" stroke="#B9A9A0" strokeWidth={1.2} fill="none" />
      <ellipse cx={48} cy={126} rx={22} ry={26} fill="#E8846B" />
      <path d="M352 150 Q348 190 356 230" stroke="#B9A9A0" strokeWidth={1.2} fill="none" />
      <ellipse cx={352} cy={120} rx={22} ry={26} fill="#8F80C2" />
      <ellipse cx={322} cy={150} rx={18} ry={22} fill="#7FA88B" />
      {/* banner string */}
      <path d="M100 18 Q200 34 300 18" stroke="#8A6E5C" strokeWidth={1.5} fill="none" />
      <Sensitive id="bday-date">
        {letters.map((ch, i) => {
          const x = 140 + i * 24;
          const y = 20 + Math.sin((i / 5) * Math.PI) * 7;
          return (
            <g key={i}>
              <path d={`M${x - 10} ${y} H${x + 10} L${x} ${y + 26}Z`} fill={["#E8846B", "#8F80C2", "#7FA88B"][i % 3]} />
              {ch && (
                <text x={x} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={800} fill="#FFFBF2" fontFamily="system-ui, sans-serif">
                  {ch}
                </text>
              )}
            </g>
          );
        })}
      </Sensitive>
      {/* kid behind the cake with a party hat */}
      <Kid x={300} y={120} s={1} shirt="#7FA88B" pants="#2B3A67" />
      <path d="M288 124 L300 92 L312 124Z" fill="#E8846B" />
      <circle cx={300} cy={92} r={4} fill="#FBE3A6" />
      {/* table */}
      <rect y={232} width={400} height={68} fill="#D9A574" />
      <rect y={232} width={400} height={6} fill="#C48F5E" />
      <ellipse cx={200} cy={240} rx={110} ry={10} fill="#FFFBF2" />
      {/* cake */}
      <rect x={115} y={160} width={170} height={78} rx={10} fill="#FFF3E6" />
      <path d="M115 172 Q115 158 130 158 H270 Q285 158 285 172 V176 Q272 186 262 176 Q250 188 238 176 Q226 188 214 176 Q202 188 190 176 Q178 188 166 176 Q154 188 142 176 Q130 188 115 178Z" fill="#F4A6B8" />
      <text x={200} y={190} textAnchor="middle" fontSize={12} fontStyle="italic" fill="#B5543F" fontFamily="Georgia, serif">
        Happy Birthday
      </text>
      <Sensitive id="bday-name">
        <text x={200} y={216} textAnchor="middle" fontSize={17} fontWeight={700} fontStyle="italic" fill="#8F4A6E" fontFamily="Georgia, serif">
          Maya Johnson
        </text>
      </Sensitive>
      <Sensitive id="bday-age">
        <text x={201} y={157} textAnchor="middle" fontSize={44} fontWeight={800} fill="#8F80C2" stroke="#6B5CA5" strokeWidth={1} fontFamily="system-ui, sans-serif">
          7
        </text>
      </Sensitive>
      <rect x={200} y={104} width={2} height={10} fill="#5A4A3A" />
      <path d="M201 92 Q206 100 201 106 Q196 100 201 92Z" fill="#F2B544" />
    </>
  );
}

function Porch() {
  return (
    <>
      <rect width={400} height={300} fill="#D7E9F0" />
      <circle cx={360} cy={36} r={18} fill="#FBE3A6" />
      {/* house */}
      <path d="M108 58 L226 8 L344 58Z" fill="#2B3A67" />
      <rect x={120} y={56} width={212} height={186} fill="#F3D9B1" />
      <rect x={138} y={78} width={48} height={50} rx={3} fill="#A9CDDC" />
      <path d="M162 78 V128 M138 103 H186" stroke="#F3D9B1" strokeWidth={3} />
      <rect x={292} y={78} width={30} height={50} rx={3} fill="#A9CDDC" />
      <rect x={250} y={142} width={42} height={98} rx={4} fill="#B5543F" />
      <circle cx={284} cy={194} r={2.5} fill="#F2D27A" />
      <Sensitive id="porch-number">
        <rect x={200} y={94} width={44} height={20} rx={4} fill="#2B3A67" />
        <text x={222} y={109} textAnchor="middle" fontSize={13} fontWeight={800} fill="#FFF7EC" fontFamily="system-ui, sans-serif">
          2417
        </text>
      </Sensitive>
      {/* steps */}
      <rect x={232} y={240} width={78} height={10} fill="#D2B48C" />
      <rect x={224} y={250} width={94} height={10} fill="#C4A27A" />
      {/* lawn */}
      <rect y={240} width={232} height={60} fill="#B7D59C" />
      <rect x={318} y={240} width={82} height={60} fill="#B7D59C" />
      <rect y={260} width={400} height={40} fill="#A7C98C" />
      {/* family */}
      <Adult x={164} y={118} s={0.85} shirt="#8F80C2" longHair />
      <Adult x={218} y={112} s={0.88} shirt="#6F9E7D" hair="#2A221E" />
      <Kid x={192} y={168} s={0.68} shirt="#E8846B" />
      {/* mailbox */}
      <rect x={117} y={190} width={6} height={64} fill="#8B5E3C" />
      <rect x={100} y={170} width={40} height={22} rx={8} fill="#6F9E7D" />
      <Sensitive id="porch-mailbox">
        <rect x={103} y={175} width={34} height={12} rx={2} fill="#FFFBF2" />
        <text x={120} y={184.5} textAnchor="middle" fontSize={7.5} fontWeight={800} fill="#2B3A67" fontFamily="system-ui, sans-serif">
          JOHNSON
        </text>
      </Sensitive>
      {/* street sign */}
      <rect x={47} y={48} width={5} height={212} fill="#8A8F9C" />
      <Sensitive id="porch-street">
        <rect x={14} y={46} width={72} height={22} rx={3} fill="#4C7A5A" stroke="#FFFBF2" strokeWidth={1.5} />
        <text x={50} y={61} textAnchor="middle" fontSize={10} fontWeight={800} fill="#FFFBF2" fontFamily="system-ui, sans-serif">
          JUNIPER LN
        </text>
      </Sensitive>
      {/* car */}
      <path d="M296 236 Q300 212 324 208 L348 194 Q360 188 378 190 L400 192 V262 H296Z" fill="#E8846B" />
      <path d="M352 198 L370 196 L374 214 L340 214Z" fill="#CFE5EC" />
      <circle cx={322} cy={264} r={13} fill="#2E2E3A" />
      <circle cx={322} cy={264} r={5} fill="#9A9AA6" />
      <rect x={296} y={232} width={10} height={6} rx={2} fill="#FBE3A6" />
      <Sensitive id="porch-plate">
        <rect x={320} y={242} width={46} height={14} rx={2} fill="#FFFBF2" stroke="#2B3A67" strokeWidth={1} />
        <text x={343} y={252.5} textAnchor="middle" fontSize={8.5} fontWeight={800} fill="#2B3A67" fontFamily="system-ui, sans-serif">
          8KDL 204
        </text>
      </Sensitive>
    </>
  );
}

function Coffee() {
  return (
    <>
      <rect width={400} height={300} fill="#C99A6E" />
      {[30, 90, 150, 210, 270].map((y) => (
        <path key={y} d={`M0 ${y} Q100 ${y + 8} 200 ${y} T400 ${y}`} stroke="#B98A5F" strokeWidth={2} fill="none" />
      ))}
      {/* latte */}
      <circle cx={100} cy={92} r={62} fill="#FFFBF2" />
      <circle cx={100} cy={92} r={46} fill="#F3E3CC" />
      <circle cx={100} cy={92} r={40} fill="#B07A4E" />
      <path d="M100 112 C80 98 82 80 94 82 C98 82 100 86 100 88 C100 86 102 82 106 82 C118 80 120 98 100 112Z" fill="#F7E6CF" />
      <path d="M160 82 Q176 82 176 96 Q176 108 160 106" stroke="#FFFBF2" strokeWidth={8} fill="none" />
      {/* croissant */}
      <path d="M272 58 Q318 18 362 58 Q350 78 318 70 Q290 80 272 58Z" fill="#E3A85C" />
      <path d="M296 44 L304 66 M318 38 L318 68 M340 44 L332 66" stroke="#C98A3E" strokeWidth={3} />
      {/* boarding pass */}
      <rect x={30} y={178} width={180} height={76} rx={6} fill="#FFFBF2" />
      <rect x={30} y={178} width={180} height={12} rx={4} fill="#E8846B" />
      <text x={38} y={187.5} fontSize={7} fontWeight={800} fill="#FFFBF2" fontFamily="system-ui, sans-serif">
        BOARDING PASS
      </text>
      <path d="M156 194 V250" stroke="#E6DCCD" strokeDasharray="3 3" />
      <Sensitive id="coffee-pass">
        <text x={38} y={206} fontSize={9} fontWeight={800} fill="#2B3A67" fontFamily="system-ui, sans-serif">
          JOHNSON/ANNA
        </text>
        <text x={38} y={222} fontSize={12} fontWeight={800} fill="#2B3A67" fontFamily="system-ui, sans-serif">
          PHX → SEA
        </text>
        <text x={38} y={240} fontSize={8} fontWeight={700} fill="#6B6F86" fontFamily="system-ui, sans-serif">
          BOOKING K7XQ2M · 14C
        </text>
      </Sensitive>
      <Sensitive id="coffee-qr">
        <rect x={162} y={188} width={42} height={42} fill="#FFFFFF" />
        {[...Array(49)].map((_, i) => {
          const r = Math.floor(i / 7);
          const c = i % 7;
          const on = (r * 3 + c * 5 + r * c) % 3 !== 0 || (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
          return on ? <rect key={i} x={164 + c * 5.4} y={190 + r * 5.4} width={5.4} height={5.4} fill="#1E2440" /> : null;
        })}
      </Sensitive>
      {/* card */}
      <rect x={216} y={152} width={154} height={94} rx={10} fill="#2B3A67" />
      <circle cx={340} cy={176} r={34} fill="#3D4F86" opacity={0.6} />
      <text x={228} y={172} fontSize={10} fontWeight={800} fill="#FBE3A6" fontFamily="system-ui, sans-serif">
        Mesa Bank
      </text>
      <rect x={228} y={182} width={22} height={16} rx={3} fill="#E3C27A" />
      <Sensitive id="coffee-card">
        <text x={228} y={218} fontSize={12.5} fontWeight={700} fill="#FFFBF2" fontFamily="ui-monospace, monospace" letterSpacing={0.5}>
          4921 8830 1147 2209
        </text>
        <text x={228} y={236} fontSize={8} fontWeight={700} fill="#D9DEEE" fontFamily="system-ui, sans-serif">
          A JOHNSON    09/29
        </text>
      </Sensitive>
    </>
  );
}

function Picnic() {
  return (
    <>
      <rect width={400} height={300} fill="#D3E8EF" />
      <ellipse cx={110} cy={250} rx={220} ry={70} fill="#B7D59C" />
      <ellipse cx={330} cy={260} rx={200} ry={70} fill="#A7C98C" />
      <path d="M60 40 Q74 30 88 40 Q102 32 108 46 H54 Q50 38 60 40Z" fill="#FFFBF2" />
      {/* tree */}
      <rect x={52} y={150} width={14} height={80} fill="#8B5E3C" />
      <circle cx={59} cy={136} r={36} fill="#7FA88B" />
      <circle cx={34} cy={156} r={20} fill="#6F9E7D" />
      {/* blanket */}
      <path d="M90 238 L190 226 L214 266 L104 282Z" fill="#E8846B" />
      <path d="M115 235 L130 279 M140 232 L157 276 M165 229 L185 272 M96 252 L200 238 M100 268 L207 252" stroke="#FFFBF2" strokeWidth={3} opacity={0.7} />
      <rect x={130} y={214} width={34} height={24} rx={4} fill="#C48F5E" />
      <path d="M134 214 Q147 198 160 214" stroke="#8B5E3C" strokeWidth={3} fill="none" />
      {/* kite */}
      <path d="M318 26 L344 52 L318 86 L292 52Z" fill="#8F80C2" />
      <path d="M318 26 V86 M292 52 H344" stroke="#FFFBF2" strokeWidth={1.5} />
      <path d="M318 86 Q312 104 322 118 Q330 132 320 146" stroke="#E8846B" strokeWidth={2} fill="none" />
      <path d="M318 86 Q300 140 278 168" stroke="#7A7A88" strokeWidth={1} fill="none" />
      <Kid x={262} y={150} s={0.95} shirt="#F2B544" armUp />
    </>
  );
}

function Sunset() {
  return (
    <>
      <rect width={400} height={300} fill="#F7C9A4" />
      <rect y={0} width={400} height={120} fill="#E9A8B4" opacity={0.5} />
      <circle cx={200} cy={170} r={50} fill="#F6E09A" />
      <path d="M0 190 Q100 140 200 186 T400 170 V300 H0Z" fill="#C98F7A" />
      <path d="M0 230 Q120 190 240 228 T400 220 V300 H0Z" fill="#8F80C2" />
      <path d="M300 230 V180 M300 196 Q290 196 290 186 M300 204 Q312 204 312 192" stroke="#4C7A5A" strokeWidth={8} strokeLinecap="round" fill="none" />
    </>
  );
}

function Dog() {
  return (
    <>
      <rect width={400} height={300} fill="#E4EFDF" />
      <ellipse cx={200} cy={270} rx={140} ry={30} fill="#BFD9A6" />
      <ellipse cx={200} cy={210} rx={80} ry={60} fill="#E3A85C" />
      <circle cx={200} cy={130} r={56} fill="#E8B46C" />
      <ellipse cx={148} cy={120} rx={18} ry={34} fill="#C98A3E" transform="rotate(20 148 120)" />
      <ellipse cx={252} cy={120} rx={18} ry={34} fill="#C98A3E" transform="rotate(-20 252 120)" />
      <circle cx={180} cy={122} r={6} fill="#2B2B2B" />
      <circle cx={220} cy={122} r={6} fill="#2B2B2B" />
      <ellipse cx={200} cy={148} rx={12} ry={8} fill="#3B2F2F" />
      <path d="M192 162 Q200 186 208 162Z" fill="#E8846B" />
      <rect x={168} y={176} width={64} height={10} rx={5} fill="#8F80C2" />
    </>
  );
}

function Flowers() {
  return (
    <>
      <rect width={400} height={300} fill="#F4EBDD" />
      <rect y={230} width={400} height={70} fill="#A7C98C" />
      {[60, 130, 200, 270, 340].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 240 Q${x + 8} 190 ${x} ${140 + (i % 2) * 30}`} stroke="#6F9E7D" strokeWidth={5} fill="none" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={x}
              cy={(140 + (i % 2) * 30) - 14}
              rx={9}
              ry={16}
              fill={["#E8846B", "#8F80C2", "#F2B544", "#F4A6B8", "#E8846B"][i]}
              transform={`rotate(${a} ${x} ${140 + (i % 2) * 30})`}
            />
          ))}
          <circle cx={x} cy={140 + (i % 2) * 30} r={7} fill="#FBE3A6" />
        </g>
      ))}
    </>
  );
}

function PrivateBlur() {
  return (
    <>
      <defs>
        <linearGradient id="pm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D9D0F0" />
          <stop offset="1" stopColor="#F3D8CF" />
        </linearGradient>
      </defs>
      <rect width={400} height={300} fill="url(#pm-g)" />
      <circle cx={120} cy={120} r={70} fill="#FFFFFF" opacity={0.35} />
      <circle cx={290} cy={190} r={90} fill="#FFFFFF" opacity={0.25} />
    </>
  );
}

const ART: Record<SceneId, () => JSX.Element> = {
  school: School,
  birthday: Birthday,
  porch: Porch,
  coffee: Coffee,
  private: PrivateBlur,
  picnic: Picnic,
  sunset: Sunset,
  dog: Dog,
  flowers: Flowers,
};

export default function SceneArt({
  id,
  edits = {},
  className = "",
  showPrivateCard = true,
}: {
  id: SceneId;
  edits?: Record<string, ObjMode>;
  className?: string;
  showPrivateCard?: boolean;
}) {
  const filterId = `blur-${useId().replace(/:/g, "")}`;
  const Art = ART[id];
  const scene = SCENES[id];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} className="block h-full w-full" role="img" aria-label={scene.alt} preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={6} />
          </filter>
        </defs>
        <SceneContext.Provider value={{ filterId, edits }}>
          <Art />
        </SceneContext.Provider>
      </svg>
      {scene.privateMoment && showPrivateCard && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center backdrop-blur-sm">
          <ShieldCheck className="h-7 w-7 text-[#5C4C9C]" aria-hidden />
          <p className="text-[13px] font-semibold leading-tight text-[#3B2F6B]">Private moment detected.</p>
          <p className="text-[11px] leading-tight text-[#5C4C9C]">This photo stays on your phone.</p>
        </div>
      )}
    </div>
  );
}
