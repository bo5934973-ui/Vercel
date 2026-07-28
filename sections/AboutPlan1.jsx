"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring
} from "framer-motion";
import { useLiveContent } from "@/components/LiveContentProvider";

export function AboutPlan1() {
  const { content } = useLiveContent();
  const growth = content.growth;
  const careerJourney = growth.items;
  const [activeIndex, setActiveIndex] = useState(careerJourney.length - 1);
  const tabRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(-240);
  const pointerY = useMotionValue(240);
  const ambientX = useSpring(pointerX, { stiffness: 72, damping: 26, mass: 0.8 });
  const ambientY = useSpring(pointerY, { stiffness: 72, damping: 26, mass: 0.8 });

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, careerJourney.length - 1));
  }, [careerJourney.length]);

  useEffect(() => {
    const section = document.querySelector("#about");

    if (!section) return undefined;

    if (!("IntersectionObserver" in window)) {
      section.dataset.visible = "true";
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.dataset.visible = "true";
      },
      { threshold: 0.18 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function selectJourney(index) {
    setActiveIndex(index);
  }

  function handlePointerMove(event) {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - bounds.left - 240);
    pointerY.set(event.clientY - bounds.top - 240);
  }

  function handlePointerLeave() {
    if (reduceMotion) return;

    pointerX.set(-240);
    pointerY.set(240);
  }

  function handleKeyDown(event, index) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;

    if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
      nextIndex = (index - 1 + careerJourney.length) % careerJourney.length;
    }

    if (["ArrowDown", "ArrowRight"].includes(event.key)) {
      nextIndex = (index + 1) % careerJourney.length;
    }

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = careerJourney.length - 1;

    selectJourney(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <motion.section
      id="about"
      className="career-section px-6 py-24 text-white md:px-20 md:py-32"
      aria-labelledby="career-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="career-pointer-light"
        style={reduceMotion ? { display: "none" } : { x: ambientX, y: ambientY }}
        aria-hidden="true"
      />

      <div className="career-shell mx-auto grid max-w-[1440px] gap-16 xl:grid-cols-[0.86fr_1.14fr] xl:gap-20">
        <header className="career-heading xl:pt-2">
          <p className="career-kicker">{growth.eyebrow}</p>
          <h2
            id="career-title"
            className="mt-7 max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-[60px]"
          >
            {growth.title}
            <span className="block text-white/36">{growth.highlight}</span>
          </h2>
          <p className="mt-8 max-w-md text-base leading-7 text-white/52 md:text-lg md:leading-8">
            {growth.description}
          </p>

          <div className="career-summary mt-14" aria-hidden="true">
            <span className="career-summary-number">
              {String(careerJourney.length).padStart(2, "0")}
            </span>
            <span className="career-summary-copy">
              {growth.summaryLabel}
              <small>{growth.summaryText}</small>
            </span>
          </div>
        </header>

        <div className="career-map" role="tablist" aria-label="按年份查看工作历程">
          {careerJourney.map((journey, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={journey.year}
                className="career-record"
                data-active={isActive}
                layout={reduceMotion ? false : "position"}
                transition={{ layout: { duration: 0.52, ease: [0.16, 1, 0.3, 1] } }}
              >
                {isActive ? (
                  <motion.span
                    className="career-record-active-surface"
                    layoutId={reduceMotion ? undefined : "career-record-active-surface"}
                    transition={{ type: "spring", stiffness: 250, damping: 32 }}
                    aria-hidden="true"
                  />
                ) : null}

                <motion.button
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`career-plan1-tab-${journey.year}`}
                  className="career-record-trigger"
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`career-plan1-panel-${journey.year}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectJourney(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  whileHover={reduceMotion ? undefined : { x: 4 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.992 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                >
                  <span className="career-record-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="career-record-year">{journey.year}</span>
                  <span className="career-record-heading">
                    <small>{journey.chapter}</small>
                    <strong>{journey.title}</strong>
                  </span>
                  <span className="career-record-toggle" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </motion.button>

                {isActive ? (
                  <motion.div
                    key={`panel-${journey.year}`}
                    id={`career-plan1-panel-${journey.year}`}
                    className="career-panel-motion"
                    role="tabpanel"
                    aria-labelledby={`career-plan1-tab-${journey.year}`}
                    layoutId={reduceMotion ? undefined : "career-detail-panel"}
                    initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            layout: { type: "spring", stiffness: 240, damping: 32 },
                            opacity: { duration: 0.22 },
                            y: { duration: 0.34, ease: [0.16, 1, 0.3, 1] }
                          }
                    }
                  >
                    <div className="career-record-panel">
                      <p>{journey.description}</p>
                      <div className="career-focuses">
                        {journey.focus.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
