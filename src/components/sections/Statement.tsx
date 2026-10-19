import type { StatementSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { LoopVideo } from "@/components/ui/LoopVideo";

// Program description: the copy beside an editorial arrangement of real clips and photos.
export function Statement({ s }: { s: StatementSection }) {
  const media = s.media ?? [];
  return (
    <section className="section describe" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container describe__grid">
        <div className="describe__copy">
          {s.eyebrow && (
            <h2 className="eyebrow" id={`${s._key}-h`}>
              {s.eyebrow}
            </h2>
          )}
          {s.statement && <p className="describe__title">{s.statement}</p>}
          <p className="describe__body">{s.body}</p>
        </div>
        {media.length > 0 && (
          <div className="describe__media" data-count={media.length}>
            {media.map((m, i) => (
              <figure key={m._key} className={`describe__item describe__item--${i}`}>
                {m.kind === "video" ? (
                  <LoopVideo clip={m.clip} />
                ) : (
                  <Picture img={m.img} sizes="(max-width: 899px) 50vw, 25vw" />
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
