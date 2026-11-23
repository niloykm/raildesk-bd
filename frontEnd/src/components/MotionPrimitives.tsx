import React, { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const TRANSIT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const TAB_SPRING = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 31,
};

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-emerald-500 origin-left z-50 pointer-events-none"
      style={{ scaleX }}
    />
  );
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.38, delay, ease: TRANSIT_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RouteTransitionProps {
  routeKey: string;
  children: ReactNode;
  className?: string;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  routeKey,
  children,
  className = '',
}) => {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: TRANSIT_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
