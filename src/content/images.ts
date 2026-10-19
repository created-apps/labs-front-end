import type { Img } from "@/lib/types";

// Real photos from previous CreatED Labs cohorts. Students are intentionally not named.
const lab = (name: string, width: number, height: number, alt: string): Img => ({
  src: `/images/lab/${name}.jpg`,
  width,
  height,
  alt,
});

export const labImages = {
  pipetteAmber: lab("lab-pipette-amber", 1350, 1800, "Student pipetting into an amber solution on a magnetic stirrer"),
  refluxSetup: lab("lab-reflux-setup", 1200, 1600, "Student running a reflux set-up on a hot plate stirrer"),
  stirrerPipette: lab("lab-stirrer-pipette", 1350, 1800, "Student adding a reagent to a beaker on a magnetic stirrer"),
  stirrerObserve: lab("lab-stirrer-observe", 1350, 1800, "Student watching a solution mix on a magnetic stirrer"),
  stirrerBeaker: lab("lab-stirrer-beaker", 1350, 1800, "Student checking a beaker on a magnetic stirrer"),
  stirrerAdjust: lab("lab-stirrer-adjust", 1350, 1800, "Student adjusting a beaker on a stirrer during an experiment"),
  hotplateStir: lab("lab-hotplate-stir", 1200, 1600, "Student stirring an amber mixture on a hot plate"),
  foilBeaker: lab("lab-foil-beaker", 1350, 1800, "Student preparing a foil-covered beaker for a light-sensitive reaction"),
  sampleSeries: lab("lab-sample-series", 1013, 1800, "Student preparing a series of sample solutions"),
  blueFilm: lab("lab-blue-film", 1200, 1600, "Student spreading a blue material film to dry"),
  benchPortrait: lab("lab-bench-portrait", 768, 1024, "Student at the lab bench with a blue material sample"),
  tweezersSample: lab("lab-tweezers-sample", 1200, 1600, "Student handling a sample with tweezers"),
  benchCutting: lab("lab-bench-cutting", 1200, 1600, "Student cutting a sample at the lab bench"),
  balance: lab("lab-balance", 1200, 1600, "Student measuring a reagent beside an analytical balance"),
  biosafety: lab("lab-biosafety-cabinet", 960, 1280, "Student working with a petri dish inside a biosafety cabinet"),
  oven: lab("lab-oven", 1600, 1200, "Student loading samples into a laboratory oven"),
  incubator: lab("lab-incubator", 1086, 1448, "Petri dishes growing inside a laboratory incubator"),
  lightInspection: lab("lab-light-inspection", 1600, 1200, "Student inspecting a sample over a light source"),
  sampleMeasurement: lab("lab-sample-measurement", 1200, 1600, "Student taking a reading from a sample on foil"),
  samplePrepFoil: lab("lab-sample-prep-foil", 1350, 1800, "Student preparing samples on aluminium foil"),
  sampleHold: lab("lab-sample-hold", 1200, 1600, "Student holding up a finished sample to the light"),
  laptopWriting: lab("lab-laptop-writing", 1350, 1800, "Student writing up research on a laptop in the lab"),
  foilTweezers: lab("lab-foil-tweezers", 1350, 1800, "Student placing samples onto foil with tweezers"),
  sampleVial: lab("lab-sample-vial", 1200, 1600, "Student holding up a vial of her sample"),
  yellowBeaker: lab("lab-yellow-beaker", 1200, 1600, "Student checking a yellow mixture in a beaker"),
} satisfies Record<string, Img>;

// Abstract decorative textures generated with Gemini (no people, no projects).
export const textures = {
  dispersion: { src: "/images/generated/texture-dispersion.jpg", width: 1200, height: 896, alt: "" },
  caustics: { src: "/images/generated/texture-caustics.jpg", width: 1376, height: 768, alt: "" },
  glassAzure: { src: "/images/generated/texture-glass-azure.jpg", width: 1376, height: 768, alt: "" },
} satisfies Record<string, Img>;
