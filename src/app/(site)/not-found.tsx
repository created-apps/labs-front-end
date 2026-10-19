import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="container prose">
        <p className="eyebrow">404</p>
        <h1>This page has evaporated.</h1>
        <p className="lede">The page you were looking for isn&apos;t here. The CreatED Labs program page is.</p>
        <p>
          <Link className="btn" href="/">
            Go to CreatED Labs
          </Link>
        </p>
      </div>
    </section>
  );
}
