import { defineQuery } from "next-sanity";

// Every image resolves to the frontend's Img shape.
const img = `{
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  alt,
  caption,
  "focus": hotspot{x, y}
}`;

const seo = `seo{title, description, noIndex, "image": image${img}}`;

const sections = `sections[]{
  ...,
  "anchorId": anchorId.current,
  _type == "statementSection" => { "media": media[]{
    _key,
    _type == "figure" => { "kind": "image", "img": @${img} },
    _type == "videoClip" => { "kind": "video", "clip": { "src": file.asset->url, "poster": poster.asset->url, "alt": coalesce(alt, "") } }
  } },
  _type == "labSection" => {
    "images": images[]${img},
    "clips": clips[]{ "src": file.asset->url, "poster": poster.asset->url, "alt": coalesce(alt, "") }
  },
  _type == "mentorSection" => {
    "clip": select(defined(clip.file) => { "src": clip.file.asset->url, "poster": clip.poster.asset->url, "alt": coalesce(clip.alt, "") }, null),
    "clip2": select(defined(clip2.file) => { "src": clip2.file.asset->url, "poster": clip2.poster.asset->url, "alt": coalesce(clip2.alt, "") }, null),
    "photo": select(defined(photo.asset) => photo${img}, null)
  },
  _type == "audienceSection" => { "photos": photos[]${img} },
  _type == "faqSection" => { "image": image${img} },
  _type == "roadmapSection" => { "milestones": milestones[]{..., "image": image${img}, "photos": photos[]${img}} },
  _type == "ctaSection" => { "images": images[]${img} },
  _type == "notebookSection" => { "notes": notes[]{..., "links": links[]{label, href, "logo": select(defined(logo.asset) => { "src": logo.asset->url, "width": logo.asset->metadata.dimensions.width, "height": logo.asset->metadata.dimensions.height }, null)}} },
  _type == "outcomesSection" => { "items": items[]{..., "links": links[]{label, href, "logo": select(defined(logo.asset) => { "src": logo.asset->url, "width": logo.asset->metadata.dimensions.width, "height": logo.asset->metadata.dimensions.height }, null)}} },
  _type == "videoSection" => { "video": video.asset->{url, mimeType}, "poster": poster${img} }
}`;

const programFields = `
  _id,
  title,
  "slug": slug.current,
  isHome,
  summary,
  startDate,
  endDate,
  seats,
  fee,
  ${seo},
  ${sections},
  "updatedAt": _updatedAt
`;

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  ...,
  "brochure": brochure.asset->{url, "filename": originalFilename},
  "defaultSeo": defaultSeo{title, description, noIndex, "image": image${img}}
}`);

export const homeProgramQuery = defineQuery(`*[_type == "program" && isHome == true] | order(_updatedAt desc)[0]{${programFields}}`);

export const programQuery = defineQuery(`*[_type == "program" && slug.current == $slug][0]{${programFields}}`);

export const programSlugsQuery = defineQuery(
  `*[_type == "program" && defined(slug.current) && isHome != true && seo.noIndex != true]{"slug": slug.current, "updatedAt": _updatedAt}`,
);

const projectSummary = `_id, title, "slug": slug.current, summary, year, "cover": cover${img}`;

export const projectQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  ${projectSummary},
  students,
  body,
  "gallery": gallery[]${img},
  paperUrl,
  awards,
  ${seo},
  "updatedAt": _updatedAt
}`);

export const projectSlugsQuery = defineQuery(
  `*[_type == "project" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, "updatedAt": _updatedAt}`,
);

export const extrasQuery = defineQuery(`{
  "projects": *[_type == "project" && defined(slug.current)] | order(year desc, _createdAt desc)[0...6]{${projectSummary}},
  "testimonials": *[_type == "testimonial"] | order(order asc, _createdAt asc){_id, quote, name, role},
  "achievements": *[_type == "achievement"] | order(order asc, _createdAt asc){_id, title, detail, year}
}`);

export const redirectQuery = defineQuery(`*[_type == "redirect" && from == $path][0]{to, permanent}`);
