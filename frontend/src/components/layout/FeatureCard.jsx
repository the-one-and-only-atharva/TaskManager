import React from "react";
import { motion } from "framer-motion";
import {
  hierarchyItemPop as hierarchyItemVariants,
  simpleFadeUp as itemVariants,
} from "../ui/variants";

function FeatureCard({
  imageSrc,
  imageAlt,
  title,
  titleClass,
  description,
  examples,
  hoverRotate = 0,
  imageShadowClass = "",
}) {
  return (
    <motion.div
      variants={hierarchyItemVariants}
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
      <div className="relative mb-8 flex justify-center">
        <motion.div
          className="w-32 h-32"
          whileHover={{ scale: 1.1, rotate: hoverRotate }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className={`w-full h-full ${imageShadowClass}`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
            decoding="async"
            width={128}
            height={128}
          />
        </motion.div>
      </div>

      <motion.h3 variants={itemVariants} className={titleClass}>
        {title}
      </motion.h3>
      <motion.p
        variants={itemVariants}
        className="text-gray-300 leading-relaxed mb-4"
      >
        {description}
      </motion.p>
      <motion.div
        variants={itemVariants}
        className="text-sm text-gray-400 rounded-lg p-3"
      >
        {examples}
      </motion.div>
    </motion.div>
  );
}

export default FeatureCard;
