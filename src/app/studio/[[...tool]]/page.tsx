import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", padding: 40, maxWidth: 560 }}>
        <h1>Connect the CMS</h1>
        <p>
          The editor appears here once a Sanity project is connected. Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> as
          described in the README, then redeploy once.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
