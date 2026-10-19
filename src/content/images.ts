import type { StaticImageData } from "next/image";
import type { Img } from "@/lib/types";
// Real photos from previous CreatED Labs cohorts (src/assets/images/lab). Students are intentionally
// not named. Static imports give each photo its real size and a blur placeholder.
import labPipetteAmber from "@/assets/images/lab/lab-pipette-amber.jpg";
import labRefluxSetup from "@/assets/images/lab/lab-reflux-setup.jpg";
import labStirrerPipette from "@/assets/images/lab/lab-stirrer-pipette.jpg";
import labStirrerObserve from "@/assets/images/lab/lab-stirrer-observe.jpg";
import labStirrerBeaker from "@/assets/images/lab/lab-stirrer-beaker.jpg";
import labStirrerAdjust from "@/assets/images/lab/lab-stirrer-adjust.jpg";
import labHotplateStir from "@/assets/images/lab/lab-hotplate-stir.jpg";
import labFoilBeaker from "@/assets/images/lab/lab-foil-beaker.jpg";
import labSampleSeries from "@/assets/images/lab/lab-sample-series.jpg";
import labBlueFilm from "@/assets/images/lab/lab-blue-film.jpg";
import labBenchPortrait from "@/assets/images/lab/lab-bench-portrait.jpg";
import labTweezersSample from "@/assets/images/lab/lab-tweezers-sample.jpg";
import labBenchCutting from "@/assets/images/lab/lab-bench-cutting.jpg";
import labBalance from "@/assets/images/lab/lab-balance.jpg";
import labBiosafetyCabinet from "@/assets/images/lab/lab-biosafety-cabinet.jpg";
import labOven from "@/assets/images/lab/lab-oven.jpg";
import labIncubator from "@/assets/images/lab/lab-incubator.jpg";
import labLightInspection from "@/assets/images/lab/lab-light-inspection.jpg";
import labSampleMeasurement from "@/assets/images/lab/lab-sample-measurement.jpg";
import labSamplePrepFoil from "@/assets/images/lab/lab-sample-prep-foil.jpg";
import labSampleHold from "@/assets/images/lab/lab-sample-hold.jpg";
import labLaptopWriting from "@/assets/images/lab/lab-laptop-writing.jpg";
import labFoilTweezers from "@/assets/images/lab/lab-foil-tweezers.jpg";
import labSampleVial from "@/assets/images/lab/lab-sample-vial.jpg";
import labYellowBeaker from "@/assets/images/lab/lab-yellow-beaker.jpg";
import crestAwards from "@/assets/images/logos/crest-awards.webp";
import irisNationalFair from "@/assets/images/logos/iris-national-fair.webp";
import textureDispersion from "@/assets/images/generated/texture-dispersion.jpg";
import textureCaustics from "@/assets/images/generated/texture-caustics.jpg";
import textureGlassAzure from "@/assets/images/generated/texture-glass-azure.jpg";

const img = (data: StaticImageData, alt: string): Img => ({
  src: data.src,
  width: data.width,
  height: data.height,
  lqip: data.blurDataURL ?? null,
  alt,
});

export const labImages = {
  pipetteAmber: img(labPipetteAmber, "Student pipetting into an amber solution on a magnetic stirrer"),
  refluxSetup: img(labRefluxSetup, "Student running a reflux set-up on a hot plate stirrer"),
  stirrerPipette: img(labStirrerPipette, "Student adding a reagent to a beaker on a magnetic stirrer"),
  stirrerObserve: img(labStirrerObserve, "Student watching a solution mix on a magnetic stirrer"),
  stirrerBeaker: img(labStirrerBeaker, "Student checking a beaker on a magnetic stirrer"),
  stirrerAdjust: img(labStirrerAdjust, "Student adjusting a beaker on a stirrer during an experiment"),
  hotplateStir: img(labHotplateStir, "Student stirring an amber mixture on a hot plate"),
  foilBeaker: img(labFoilBeaker, "Student preparing a foil-covered beaker for a light-sensitive reaction"),
  sampleSeries: img(labSampleSeries, "Student preparing a series of sample solutions"),
  blueFilm: img(labBlueFilm, "Student spreading a blue material film to dry"),
  benchPortrait: img(labBenchPortrait, "Student at the lab bench with a blue material sample"),
  tweezersSample: img(labTweezersSample, "Student handling a sample with tweezers"),
  benchCutting: img(labBenchCutting, "Student cutting a sample at the lab bench"),
  balance: img(labBalance, "Student measuring a reagent beside an analytical balance"),
  biosafety: img(labBiosafetyCabinet, "Student working with a petri dish inside a biosafety cabinet"),
  oven: img(labOven, "Student loading samples into a laboratory oven"),
  incubator: img(labIncubator, "Petri dishes growing inside a laboratory incubator"),
  lightInspection: img(labLightInspection, "Student inspecting a sample over a light source"),
  sampleMeasurement: img(labSampleMeasurement, "Student taking a reading from a sample on foil"),
  samplePrepFoil: img(labSamplePrepFoil, "Student preparing samples on aluminium foil"),
  sampleHold: img(labSampleHold, "Student holding up a finished sample to the light"),
  laptopWriting: img(labLaptopWriting, "Student writing up research on a laptop in the lab"),
  foilTweezers: img(labFoilTweezers, "Student placing samples onto foil with tweezers"),
  sampleVial: img(labSampleVial, "Student holding up a vial of her sample"),
  yellowBeaker: img(labYellowBeaker, "Student checking a yellow mixture in a beaker"),
} satisfies Record<string, Img>;

// Official competition logos, shown at their own proportions.
const logo = (data: StaticImageData) => ({ src: data.src, width: data.width, height: data.height });
export const logos = {
  crestAwards: logo(crestAwards),
  irisNationalFair: logo(irisNationalFair),
};

// Abstract decorative textures generated with Gemini (no people, no projects).
export const textures = {
  dispersion: img(textureDispersion, ""),
  caustics: img(textureCaustics, ""),
  glassAzure: img(textureGlassAzure, ""),
} satisfies Record<string, Img>;
