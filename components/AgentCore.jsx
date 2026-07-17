"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const CAPABILITIES = [
  { label: "视觉设计", position: "top-left" },
  { label: "品牌系统", position: "top-right" },
  { label: "3D 渲染", position: "bottom-right" },
  { label: "AI 创意", position: "bottom-left" }
];

export function AgentCore() {
  const parallaxRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const updateTilt = (rotateX, rotateY) => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!parallaxRef.current) return;
      parallaxRef.current.style.setProperty("--core-rotate-x", `${rotateX}deg`);
      parallaxRef.current.style.setProperty("--core-rotate-y", `${rotateY}deg`);
    });
  };

  const handlePointerMove = (event) => {
    if (
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    updateTilt(y * -6, x * 6);
  };

  return (
    <div
      className="agent-core-static"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => updateTilt(0, 0)}
      role="img"
      aria-label="Ice-blue Design Core with four creative capabilities"
    >
      <div ref={parallaxRef} className="agent-core-static-parallax">
        <div className="agent-core-static-float">
          <div className="agent-core-static-label-orbit" aria-hidden="true">
            {CAPABILITIES.map((capability) => (
              <span
                key={capability.label}
                className={`agent-core-static-label agent-core-static-label--${capability.position}`}
              >
                {capability.label}
              </span>
            ))}
          </div>

          <div className="agent-core-static-spin">
            <Image
              src="/design-core-static.png"
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 92vw, (max-width: 1200px) 54vw, 720px"
              className="agent-core-static-image"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="agent-core-static-shadow" aria-hidden="true" />
    </div>
  );
}
