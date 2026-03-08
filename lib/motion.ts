/**
 * Centralized Framer Motion spring configurations.
 * All animated components should import from here for consistency.
 */

export const SPRING_CONFIG = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export const SPRING_FAST = {
  type: "spring",
  stiffness: 400,
  damping: 35,
} as const;

export const SPRING_MARKER = {
  type: "spring",
  stiffness: 400,
  damping: 25,
} as const;

export const TRANSITION_CARD = {
  duration: 0.15,
  ease: "easeOut",
} as const;

/** Page-load stagger variants for container elements */
export const PAGE_CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

/** Page-load stagger variants for child items */
export const PAGE_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
} as const;

/** VenueList stagger variants */
export const LIST_CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

export const LIST_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;
