import { useEffect, useRef } from "react";

export default function V2NeuralMap({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const styles = getComputedStyle(canvas);
    const line = styles.getPropertyValue("--ops-network").trim();
    const colors = ["--ops-text", "--ops-accent", "--ops-cyan"].map(key => styles.getPropertyValue(key).trim());
    let frame = 0;
    let angle = 0;
    let width = 600;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = new ResizeObserver(entries => {
      width = entries[0]?.contentRect.width ?? 600;
      const ratio = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * ratio;
      canvas.height = width * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    });
    resize.observe(canvas);
    const points = Array.from({ length: 180 }, (_, i) => {
      const y = 1 - (i / 179) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = i * 2.399963;
      return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
    });
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, width);
      if (!paused && !reduced) angle += 0.0017;
      const radius = width * 0.4;
      const projected = points.map(p => {
        const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
        return { x: width / 2 + x * radius, y: width / 2 + p.y * radius, z };
      });
      ctx.strokeStyle = line;
      ctx.lineWidth = 0.6;
      projected.forEach((p, i) => {
        projected.slice(i + 1).forEach(q => {
          if (Math.hypot(p.x - q.x, p.y - q.y) < width * 0.105 && Math.abs(p.z - q.z) < 0.45) {
            ctx.globalAlpha = 0.2 + (p.z + 1) * 0.22;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        });
        ctx.globalAlpha = 0.25 + (p.z + 1) * 0.35;
        ctx.fillStyle = colors[i % 3] ?? line;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.z > 0 ? 1.6 : 0.8, 0, Math.PI * 2); ctx.fill();
      });
      for (let i = 0; i < 380; i++) {
        const a = i * 2.399963 + angle * 2;
        const r = Math.sqrt(i / 380) * width * 0.13;
        ctx.globalAlpha = 0.45 + Math.sin(i * 7) * 0.3;
        ctx.fillStyle = colors[i % 3] ?? line;
        ctx.fillRect(width / 2 + Math.cos(a) * r, width / 2 + Math.sin(a) * r * Math.cos(i * 0.8), 1.5, 1.5);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); };
  }, [paused]);
  return <canvas ref={ref} className="ops-neural-canvas" role="img" aria-label="Mappa animata delle connessioni tra Cora e gli agenti del workspace" />;
}