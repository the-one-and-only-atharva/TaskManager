import React from "react";
import { motion } from "framer-motion";
import {
  hierarchyContainerStagger,
  hierarchyItemPop,
  simpleFadeUp,
} from "../ui/variants";
import highPriority from "../../assets/high-priority.svg";
import medPriority from "../../assets/med-priority.svg";
import lowPriority from "../../assets/low-priority.svg";
import FeatureCard from "./FeatureCard";

const hierarchySectionVariants = hierarchyContainerStagger;
const hierarchyItemVariants = hierarchyItemPop;
const itemVariants = simpleFadeUp;
// Removed unused imageVariants to avoid unused variable warnings

function HierarchySection() {
  return (
    <motion.div
      id="hierarchy-section"
      className="relative"
      initial="hidden"
      whileInView="visible"
      variants={hierarchySectionVariants}
    >
      <div className="container mx-auto px-6 mt-2">
        <motion.div variants={itemVariants} className="text-center mb-20">
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-bold text-white mb-6"
          >
            Task Priorities
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Focus on what matters now. Categorize your tasks by priority to move
            the needle with clarity.
          </motion.p>
        </motion.div>

        <motion.div
          variants={hierarchySectionVariants}
          className="grid lg:grid-cols-3 gap-16 items-start max-w-6xl mx-auto py-18 px-12 mb-10 bg-white/5 rounded-xl backdrop-blur-lg"
        >
          <FeatureCard
            imageSrc={highPriority}
            imageAlt="High priority"
            title="High Priority"
            titleClass="text-2xl font-bold text-red-400 mb-4"
            description="Critical tasks that require immediate attention. These unblock progress or have near-term deadlines."
            examples="Examples: Fix production bug, Prepare investor deck, Submit application"
            hoverRotate={10}
            imageShadowClass="drop-shadow-[0_0_20px_rgba(248,113,113,0.6)]"
          />
          <FeatureCard
            imageSrc={medPriority}
            imageAlt="Medium priority"
            title="Medium Priority"
            titleClass="text-2xl font-bold text-amber-300 mb-4"
            description="Important tasks that move work forward but aren’t urgent. Schedule these into upcoming cycles."
            examples="Examples: Write docs, Refactor module, Research tools"
            hoverRotate={-8}
            imageShadowClass="drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
          />
          <FeatureCard
            imageSrc={lowPriority}
            imageAlt="Low priority"
            title="Low Priority"
            titleClass="text-2xl font-bold text-sky-300 mb-4"
            description="Nice-to-have tasks, experiments, or ideas. Park these for when bandwidth allows."
            examples="Examples: Polish UI, Explore animation idea, Tidy backlog"
            hoverRotate={6}
            imageShadowClass="drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HierarchySection;
