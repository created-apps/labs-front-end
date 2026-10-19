import type { NextStepsSection } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

export function NextSteps({ s }: { s: NextStepsSection }) {
  return (
    <section className="section" style={{ paddingTop: 0 }} id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container">
        <div className="next-steps glass">
          <h2 id={`${s._key}-h`} style={{ fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)" }}>
            {s.heading}
          </h2>
          <div>
            {s.intro && <p>{s.intro}</p>}
            <ul>
              {s.points.map((p) => (
                <li key={p}>
                  <Icon name="mail" size={26} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
