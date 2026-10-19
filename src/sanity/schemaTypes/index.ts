import * as objects from "./objects";
import * as documents from "./documents";

// Every exported schema definition (the sectionTypes name list is not a schema type).
const objectTypes = Object.entries(objects)
  .filter(([name]) => name !== "sectionTypes")
  .map(([, def]) => def);

export const schemaTypes = [...objectTypes, ...Object.values(documents)] as (typeof documents)[keyof typeof documents][];
