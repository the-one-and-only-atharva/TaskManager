import { useState, useRef } from "react";

/**
 * Custom hook for managing section visibility and scrolling
 */
export const useSectionManagement = () => {
  const [showPlanning, setShowPlanning] = useState(false);
  const [showRisk, setShowRisk] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showArrange, setShowArrange] = useState(false);
  const [scrollTarget, setScrollTarget] = useState(null);

  // Refs for scrolling
  const editorScrollRef = useRef(null);
  const planningRef = useRef(null);
  const riskRef = useRef(null);
  const trackingRef = useRef(null);
  const arrangeRef = useRef(null);

  const smoothScrollWithin = (container, to) => {
    if (!container) return;
    try {
      container.scrollTo({ top: to, behavior: "smooth" });
    } catch (_) {
      container.scrollTop = to;
    }
  };

  const scrollSectionIntoView = (sectionEl) => {
    const container = editorScrollRef.current;
    if (!container || !sectionEl) return;
    const containerRect = container.getBoundingClientRect();
    const sectionRect = sectionEl.getBoundingClientRect();
    const currentScrollTop = container.scrollTop;
    const topOffset = sectionRect.top - containerRect.top + currentScrollTop;
    const bottomOffset =
      sectionRect.bottom - containerRect.top + currentScrollTop;
    const containerHeight = container.clientHeight;
    const margin = 12;
    // If section is taller than the container, align to top
    if (sectionRect.height >= containerHeight) {
      smoothScrollWithin(container, Math.max(0, topOffset - margin));
      return;
    }
    // If section is above the viewport
    if (topOffset < currentScrollTop + margin) {
      smoothScrollWithin(container, Math.max(0, topOffset - margin));
      return;
    }
    // If section bottom is below the viewport
    const viewportBottom = currentScrollTop + containerHeight;
    if (bottomOffset > viewportBottom - margin) {
      const target = bottomOffset - containerHeight + margin;
      smoothScrollWithin(container, Math.max(0, target));
    }
  };

  // Helper for motion onAnimationComplete to perform one smooth scroll
  const handleSectionAnimationComplete = (section) => {
    if (scrollTarget !== section) return;
    if (section === "planning" && planningRef.current && showPlanning) {
      scrollSectionIntoView(planningRef.current);
    } else if (section === "risk" && riskRef.current && showRisk) {
      scrollSectionIntoView(riskRef.current);
    } else if (section === "tracking" && trackingRef.current && showTracking) {
      scrollSectionIntoView(trackingRef.current);
    } else if (section === "arrange" && arrangeRef.current && showArrange) {
      scrollSectionIntoView(arrangeRef.current);
    }
    setScrollTarget(null);
  };

  // Ensure only one section is open at a time (accordion behavior)
  const openSection = (section) => {
    const willOpen =
      section === "planning"
        ? !showPlanning
        : section === "risk"
        ? !showRisk
        : section === "tracking"
        ? !showTracking
        : !showArrange;
    setShowPlanning(section === "planning" ? willOpen : false);
    setShowRisk(section === "risk" ? willOpen : false);
    setShowTracking(section === "tracking" ? willOpen : false);
    setShowArrange(section === "arrange" ? willOpen : false);
    setScrollTarget(willOpen ? section : null);
  };

  return {
    // State
    showPlanning,
    showRisk,
    showTracking,
    showArrange,
    scrollTarget,
    
    // Refs
    editorScrollRef,
    planningRef,
    riskRef,
    trackingRef,
    arrangeRef,
    
    // Functions
    handleSectionAnimationComplete,
    openSection,
  };
};
