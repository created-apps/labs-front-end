import type { KeyDatesSection } from "@/lib/types";

// Key dates, then how the program runs: two live online sessions a week, and one in-person lab day.
// The two are kept visually separate so parents see at a glance what's online and what isn't.
export function KeyDates({ s }: { s: KeyDatesSection }) {
  const f = s.format;
  return (
    <section className="dates" id={s.anchorId || undefined} aria-label={s.heading || "Key dates"}>
      <div className="container">
        {s.eligibility && (
          <p className="eligible">
            <span className="eligible__label">Who can apply</span>
            <span className="eligible__value">{s.eligibility}</span>
          </p>
        )}
        <dl className="ruler glass" style={{ ["--cols" as string]: s.dates.length }}>
          {s.dates.map((d) => (
            <div className="ruler__item" key={d._key}>
              <dt className="ruler__label">{d.label}</dt>
              <dd className="ruler__value" style={{ margin: 0 }}>
                {d.value}
              </dd>
              {d.detail && (
                <dd className="ruler__detail" style={{ margin: 0 }}>
                  {d.detail}
                </dd>
              )}
            </div>
          ))}
        </dl>
        {s.note && <p className="dates__note">{s.note}</p>}
        {f && (
          <div className="format">
            <div className="format__online glass">
              <h2 className="format__title">
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <rect x="4" y="6" width="24" height="16" rx="2" />
                  <path d="M1.5 26h29M12 22.5h8" />
                </svg>
                {f.onlineTitle}
              </h2>
              <ol className="format__sessions">
                {f.sessions.map((x) => (
                  <li key={x._key}>
                    <p className="format__label">{x.label}</p>
                    <h3>{x.title}</h3>
                    <p>{x.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="format__lab">
              <h2 className="format__title">
                {/* a location pin: the one place you go in person */}
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M16 29s-9-8.6-9-15.5a9 9 0 0 1 18 0C25 20.4 16 29 16 29z" />
                  <circle cx="16" cy="13.5" r="3.4" />
                </svg>
                {f.labTitle}
              </h2>
              {f.labStat && <p className="format__stat">{f.labStat}</p>}
              <p>{f.labBody}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
