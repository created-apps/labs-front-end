"use client";
import { useEffect, useRef } from "react";
import createdLogo from "@/assets/images/brand/created-logo.png";
import workbenchHd from "@/assets/images/generated/workbench-hd.jpg";
import workbenchMd from "@/assets/images/generated/workbench-md.jpg";
import causticsSoft from "@/assets/images/generated/caustics-soft.jpg";

export function CaptureStage({ name, t, mobile, save, opening }: { name: string; t: number; mobile: boolean; save: boolean; opening: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { createStage } = await import("@/components/stage/scene");
      const logo = opening ? await (await import("@/components/stage/logo")).buildLogo(createdLogo.src) : undefined;
      createStage(ref.current!, {
        opening: logo,
        mobile,
        benchUrl: mobile ? workbenchMd.src : workbenchHd.src,
        causticsUrl: causticsSoft.src,
        onFirstFrame: () => {},
      });
      await new Promise((r) => setTimeout(r, 3000)); // let the textures load
      if (!alive) return;
      (window as unknown as { __stageStep: (s: number) => number }).__stageStep(t);
      // composite in the same task as the render, before the WebGL buffer clears (no image decode,
      // which a background browser tab may defer)
      const W = ref.current!.width, H = ref.current!.height;
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const g = c.getContext("2d")!;
      const bg = g.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#161514");
      bg.addColorStop(1, "#11100f");
      g.fillStyle = bg;
      g.fillRect(0, 0, W, H);
      g.drawImage(ref.current!, 0, 0);
      if (save) {
        const v = g.createRadialGradient(W * 0.55, H * 0.5, Math.min(W, H) * 0.45, W * 0.55, H * 0.5, Math.max(W, H) * 0.75);
        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(0,0,0,0.5)");
        g.fillStyle = v;
        g.fillRect(0, 0, W, H);
        await fetch("/api/stage-capture", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: mobile ? `${name}-mobile` : name, data: c.toDataURL("image/webp", 0.8) }),
        });
        document.body.dataset.saved = "1";
      }
      document.body.dataset.ready = "1";
    })();
    return () => {
      alive = false;
    };
  }, [t, mobile, save, name, opening]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#131211" }}>
      <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
