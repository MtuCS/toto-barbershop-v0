"use client";

import { useEffect } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import "./circular-text.css";

const getRotationTransition = (duration, from, loop = true) => ({
  from,
  to: from + 360,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

export default function CircularText({
  text = "",
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      controls.stop();
      rotation.set(0);
      return;
    }

    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [controls, onHover, rotation, shouldReduceMotion, spinDuration, text]);

  const handleHoverStart = () => {
    if (!onHover || shouldReduceMotion) return;
    const start = rotation.get();
    let transition = getTransition(spinDuration, start);
    let scale = 1;

    if (onHover === "slowDown") {
      transition = getTransition(spinDuration * 2, start);
    } else if (onHover === "speedUp") {
      transition = getTransition(spinDuration / 4, start);
    } else if (onHover === "pause") {
      transition = {
        rotate: { type: "spring", damping: 20, stiffness: 300 },
        scale: { type: "spring", damping: 20, stiffness: 300 },
      };
    } else if (onHover === "goBonkers") {
      transition = getTransition(spinDuration / 20, start);
      scale = 0.8;
    }

    controls.start({
      rotate: start + 360,
      scale,
      transition,
    });
  };

  const handleHoverEnd = () => {
    if (shouldReduceMotion) return;
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      aria-hidden="true"
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, index) => {
        const rotationDegrees = (360 / letters.length) * index;
        const factor = Math.PI / letters.length;
        const offset = factor * index;
        const transform = `rotateZ(${rotationDegrees}deg) translate3d(${offset}px, ${offset}px, 0)`;

        return (
          <span
            key={`${letter}-${index}`}
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}