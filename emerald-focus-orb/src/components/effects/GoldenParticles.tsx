import { useEffect, useRef } from "react";

export function GoldenParticles({ count = 40 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const size = Math.random() * 3 + 1;
      p.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle,#F5E6A8,#D4AF37);box-shadow:0 0 ${size * 4}px #D4AF37;opacity:${0.3 + Math.random() * 0.5};animation:float-y ${4 + Math.random() * 6}s ease-in-out ${-Math.random() * 6}s infinite;`;
      el.appendChild(p);
    }
  }, [count]);
  return <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />;
}
