"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

const orbitSlots = [
  { orbit: 1, angle: 270, size: "lg", shape: "soft", delay: "0.45s" },
  { orbit: 2, angle: 45, size: "md", shape: "round", delay: "0.64s" },
  { orbit: 2, angle: 180, size: "xl", shape: "round", delay: "0.82s" },
  { orbit: 2, angle: 300, size: "md", shape: "soft", delay: "1s" },
  { orbit: 3, angle: 132, size: "xl", shape: "round", delay: "1.18s" },
  { orbit: 3, angle: 318, size: "md", shape: "soft", delay: "1.34s" },
  { orbit: 4, angle: 27, size: "md", shape: "round", delay: "1.5s" },
  { orbit: 4, angle: 96, size: "xl", shape: "soft", delay: "1.66s" },
  { orbit: 4, angle: 218, size: "xl", shape: "soft", delay: "1.82s" },
  { orbit: 4, angle: 318, size: "md", shape: "round", delay: "1.98s" }
];

const orbitMeta = {
  1: { duration: "30s", direction: "reverse" },
  2: { duration: "40s", direction: "normal" },
  3: { duration: "50s", direction: "normal" },
  4: { duration: "60s", direction: "reverse" }
};

function OrbitNode({ node }) {
  const orbit = orbitMeta[node.orbit];

  return (
    <span
      className="portfolio-orbit-node"
      style={{
        "--node-angle": `${node.angle}deg`,
        "--node-counter-angle": `${node.angle * -1}deg`,
        "--node-delay": node.delay
      }}
    >
      <span
        className={`portfolio-orbit-node-keeper portfolio-orbit-node-keeper--${orbit.direction}`}
        style={{ "--orbit-duration": orbit.duration }}
      >
        <span
          className={`portfolio-orbit-thumbnail portfolio-orbit-thumbnail--${node.size} portfolio-orbit-thumbnail--${node.shape}`}
        >
          <img src={node.image} alt="" draggable="false" />
        </span>
      </span>
    </span>
  );
}

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1
  });
  const display = useTransform(spring, (current) =>
    Math.round(current).toString().padStart(2, "0")
  );

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return (
    <span ref={ref} className="portfolio-orbit-center-number tabular-nums">
      <motion.span>{display}</motion.span>
    </span>
  );
}

export function PortfolioOrbitVisual({ works = [] }) {
  const visualWorks = works.filter((work) => work?.coverImage);
  const orbitNodes = visualWorks.length
    ? orbitSlots.map((slot, index) => {
        const work = visualWorks[index % visualWorks.length];

        return {
          ...slot,
          image: work.coverImage,
          slug: work.slug || `work-${index}`
        };
      })
    : [];
  const workCount = works.length;

  return (
    <div
      className="portfolio-orbit-visual"
      role="img"
      aria-label={`${workCount} 个精选设计项目沿四层轨道缓慢运行，组成动态作品系统`}
    >
      <div className="portfolio-orbit-aura" aria-hidden="true" />
      <div className="portfolio-orbit-field" aria-hidden="true">
        {[1, 2, 3, 4].map((orbitNumber) => {
          const orbit = orbitMeta[orbitNumber];
          const nodes = orbitNodes.filter((node) => node.orbit === orbitNumber);

          return (
            <div
              key={orbitNumber}
              className={`portfolio-orbit portfolio-orbit--${orbitNumber} portfolio-orbit--${orbit.direction}`}
              style={{ "--orbit-duration": orbit.duration }}
            >
              {nodes.map((node) => (
                <OrbitNode key={`${node.orbit}-${node.angle}-${node.slug}`} node={node} />
              ))}
            </div>
          );
        })}

        <div className="portfolio-orbit-center">
          <AnimatedNumber value={workCount} />
          <span className="portfolio-orbit-center-label">
            Selected
            <br />
            Works
          </span>
        </div>
      </div>
    </div>
  );
}
