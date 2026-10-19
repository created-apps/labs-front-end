// Vector illustrations for the mentorship stages: generic scientific motifs in the brand palette
// (charcoal line work, Sunglow and Cornflower fills). They depict no real student, project or result.
export type MentorArtName = "question" | "method" | "paper";

const INK = "#232323", SUN = "#F1CA01", CORN = "#649CF4", PINK = "#FF2E93"; // liquids are hot pink, as in the hero
const line = { fill: "none", stroke: INK, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function MentorArt({ name }: { name: MentorArtName }) {
  return (
    <svg viewBox="0 0 240 170" role="presentation" aria-hidden="true" className="mentor-art">
      {name === "question" && (
        <g>
          {/* open journal with highlighted passages */}
          <path {...line} d="M24 46 Q62 34 100 46 V138 Q62 126 24 138 Z" />
          <path {...line} d="M100 46 Q138 34 176 46 V138 Q138 126 100 138" />
          <rect x="34" y="58" width="44" height="7" rx="2" fill={SUN} />
          <rect x="114" y="82" width="38" height="7" rx="2" fill={SUN} />
          {[62, 74, 86, 98, 110].map((y) => (
            <path key={y} {...line} strokeWidth={1.4} d={`M34 ${y + 12} H88`} opacity={0.55} />
          ))}
          {[58, 70, 94, 106].map((y) => (
            <path key={y} {...line} strokeWidth={1.4} d={`M112 ${y} H166`} opacity={0.55} />
          ))}
          {/* magnifier */}
          <circle cx="150" cy="112" r="20" fill={CORN} fillOpacity={0.35} stroke={INK} strokeWidth={2} />
          <path {...line} strokeWidth={4} d="M165 127 L182 144" />
          {/* references converging on one question */}
          {[30, 62, 94].map((y) => (
            <rect key={y} x="198" y={y - 12} width="30" height="20" rx="3" fill="#fff" stroke={INK} strokeWidth={2} />
          ))}
          <path {...line} strokeDasharray="3 5" d="M198 28 Q186 60 192 120 M198 60 Q188 90 192 120 M198 92 Q194 106 192 120" />
          <circle cx="192" cy="128" r="7" fill={SUN} stroke={INK} strokeWidth={2} />
        </g>
      )}
      {name === "method" && (
        <g>
          {/* stirrer and beaker */}
          <rect x="34" y="112" width="74" height="22" rx="5" fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx="94" cy="123" r="4" fill={INK} />
          <path {...line} d="M44 54 V108 Q44 112 48 112 H94 Q98 112 98 108 V54" />
          <path d="M45 82 H97 V108 Q97 111 94 111 H48 Q45 111 45 108 Z" fill={PINK} />
          <path {...line} strokeWidth={3} d="M62 104 H80" />
          {/* pipette dropping in */}
          <path {...line} d="M71 10 V36 L74 46 L77 36 V10" />
          <ellipse cx="74" cy="8" rx="6" ry="8" fill={INK} />
          <circle cx="74" cy="64" r="3.2" fill={PINK} stroke={INK} strokeWidth={1.4} />
          {/* flask */}
          <path {...line} d="M138 50 H152 M141 50 V76 L122 116 Q120 122 126 122 H164 Q170 122 168 116 L149 76 V50" />
          <path d="M131 100 H159 L166 116 Q167 120 163 120 H127 Q123 120 124 116 Z" fill={CORN} fillOpacity={0.55} />
          {/* plan → test → record */}
          {[184, 206, 228].map((x, i) => (
            <g key={x}>
              <rect x={x - 9} y={i * 34 + 30} width="18" height="18" rx="3" fill={i === 1 ? SUN : "#fff"} stroke={INK} strokeWidth={2} />
              {i < 2 && <path {...line} d={`M${x} ${i * 34 + 52} Q${x + 2} ${i * 34 + 58} ${x + 14} ${i * 34 + 62} m-6 -5 l6 5 l-7 3`} />}
            </g>
          ))}
        </g>
      )}
      {name === "paper" && (
        <g>
          {/* scatter with a trend line */}
          <path {...line} d="M22 18 V128 H124" />
          {[[38, 108], [50, 98], [60, 102], [72, 84], [84, 80], [96, 64], [108, 58], [116, 44]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={CORN} stroke={INK} strokeWidth={1.4} />
          ))}
          <path fill="none" stroke={SUN} strokeWidth={4} strokeLinecap="round" d="M32 114 Q78 92 120 40" />
          {/* into the paper */}
          <path {...line} d="M132 86 H156 m-8 -7 l8 7 l-8 7" />
          <path {...line} d="M168 22 H212 L226 36 V148 H168 Z M212 22 V36 H226" />
          <rect x="178" y="46" width="38" height="26" rx="2" fill={CORN} fillOpacity={0.35} stroke={INK} strokeWidth={1.4} />
          <path fill="none" stroke={SUN} strokeWidth={3} strokeLinecap="round" d="M182 66 Q196 60 212 50" />
          {[84, 94, 104, 114, 124, 134].map((y, i) => (
            <path key={y} {...line} strokeWidth={1.4} opacity={0.55} d={`M178 ${y} H${i % 3 === 2 ? 200 : 216}`} />
          ))}
        </g>
      )}
    </svg>
  );
}
