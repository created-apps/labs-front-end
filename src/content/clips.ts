import type { StaticImageData } from "next/image";
import type { Clip } from "@/lib/types";
// Short, muted cuts of the students' own lab videos (src/assets/media), each with its poster frame.
// The originals are untouched in the project's Student Videos folder.
import amberStir from "@/assets/media/lab-amber-stir.mp4";
import amberStirPoster from "@/assets/media/lab-amber-stir.jpg";
import stirrerBoy from "@/assets/media/lab-stirrer-boy.mp4";
import stirrerBoyPoster from "@/assets/media/lab-stirrer-boy.jpg";
import weighing from "@/assets/media/lab-weighing.mp4";
import weighingPoster from "@/assets/media/lab-weighing.jpg";
import labelling from "@/assets/media/lab-labelling.mp4";
import labellingPoster from "@/assets/media/lab-labelling.jpg";

const clip = (src: string, poster: StaticImageData, alt: string): Clip => ({ src, poster: poster.src, alt });

export const labClips = {
  amberStir: clip(amberStir, amberStirPoster, "A CreatED Labs student pipetting into an amber solution on a stirrer"),
  stirrerBoy: clip(stirrerBoy, stirrerBoyPoster, "A CreatED Labs student adding a reagent to a beaker on a magnetic stirrer"),
  weighing: clip(weighing, weighingPoster, "A CreatED Labs student weighing out a sample at the lab bench"),
  labelling: clip(labelling, labellingPoster, "A CreatED Labs student labelling a prepared sample"),
} satisfies Record<string, Clip>;
