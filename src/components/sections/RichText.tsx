import type { RichTextSection, VideoSection } from "@/lib/types";

export function RichText({ s }: { s: RichTextSection }) {
  return (
    <section className="section" id={s.anchorId || undefined}>
      <div className="container richtext">
        {s.heading && <h2>{s.heading}</h2>}
        {s.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

export function Video({ s }: { s: VideoSection }) {
  return (
    <section className="section" id={s.anchorId || undefined}>
      <div className="container" style={{ display: "grid", gap: 20 }}>
        {s.heading && <h2>{s.heading}</h2>}
        <figure className="video-frame">
          <video controls playsInline muted preload="none" poster={s.poster?.src}>
            <source src={s.video.url} type={s.video.mimeType || "video/mp4"} />
          </video>
        </figure>
        {s.caption && <p style={{ color: "var(--muted)" }}>{s.caption}</p>}
      </div>
    </section>
  );
}
