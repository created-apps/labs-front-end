export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
/** False until a Sanity project is connected; the site then renders the bundled launch content. */
export const isSanityConfigured = projectId.length > 0;
export const studioUrl = "/studio";
