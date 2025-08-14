// Shared constants for space-themed components

// SVG Assets
import supernovaSvg from "../assets/supernova.svg";
import earthSvg from "../assets/earth.svg";
import marsSvg from "../assets/mars.svg";
import jupiterSvg from "../assets/jupiter.svg";
import saturnSvg from "../assets/saturn.svg";
import mercurySvg from "../assets/mercury.svg";
import neptuneSvg from "../assets/neptune.svg";
import moonSvg from "../assets/moon.svg";
import blueMoonSvg from "../assets/blue-moon.svg";
import meteorSvg from "../assets/meteor.svg";
import greenAsteroidSvg from "../assets/green-asteroid.svg";
import orangeAsteroidSvg from "../assets/orange-asteroid.svg";

// SVG Collections
export const PLANET_SVGS = [
  earthSvg,
  marsSvg,
  jupiterSvg,
  saturnSvg,
  mercurySvg,
  neptuneSvg,
];

export const MOON_SVGS = [
  moonSvg,
  blueMoonSvg,
  meteorSvg,
  greenAsteroidSvg,
  orangeAsteroidSvg,
];

// Helper functions
export const getPlanetSvg = (index) => PLANET_SVGS[index % PLANET_SVGS.length];
export const getMoonSvg = (index) => MOON_SVGS[index % MOON_SVGS.length];

// Orbital constants
export const ORBIT_CONFIG = {
  PLANET_ORBIT_RADIUS_BASE: 180,
  PLANET_ORBIT_RADIUS_STEP: 120,
  PLANET_ICON_HALF_SIZE: 30,
  MOON_ORBIT_RADIUS_BASE: 64,
  MOON_ORBIT_RADIUS_STEP: 32,
  MOON_ICON_HALF_SIZE: 20,
  STAR_ICON_HALF_SIZE: 64,
  SYSTEM_MARGIN: 32,
};

// Individual assets for direct import
export { supernovaSvg };

// Utility functions
export const generateId = () => Math.random().toString(36).slice(2, 9);
