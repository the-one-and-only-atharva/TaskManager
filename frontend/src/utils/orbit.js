// Utilities for orbital layout math and non-overlap resolution
import { ORBIT_CONFIG } from "../constants/space";

// Compute the overall radius of a star system including outermost planet and its moons
export function computeSystemRadius(star) {
  const numberOfPlanets = star?.planets?.length ?? 0;
  if (numberOfPlanets === 0) {
    return ORBIT_CONFIG.STAR_ICON_HALF_SIZE + ORBIT_CONFIG.SYSTEM_MARGIN;
  }

  const outermostPlanetOrbitRadius =
    ORBIT_CONFIG.PLANET_ORBIT_RADIUS_BASE +
    (numberOfPlanets - 1) * ORBIT_CONFIG.PLANET_ORBIT_RADIUS_STEP;

  let maximumMoonOrbitRadius = 0;
  for (const planet of star.planets) {
    const moonCount = planet?.moons?.length ?? 0;
    if (moonCount > 0) {
      const moonOrbitExtent =
        ORBIT_CONFIG.MOON_ORBIT_RADIUS_BASE +
        (moonCount - 1) * ORBIT_CONFIG.MOON_ORBIT_RADIUS_STEP;
      if (moonOrbitExtent > maximumMoonOrbitRadius) {
        maximumMoonOrbitRadius = moonOrbitExtent;
      }
    }
  }

  return (
    outermostPlanetOrbitRadius +
    ORBIT_CONFIG.PLANET_ICON_HALF_SIZE +
    maximumMoonOrbitRadius +
    ORBIT_CONFIG.MOON_ICON_HALF_SIZE +
    ORBIT_CONFIG.SYSTEM_MARGIN
  );
}

// Resolve a proposed star position so it does not overlap with other stars
export function resolveNonOverlapPosition(targetStar, otherStars, proposedX, proposedY) {
  let x = proposedX;
  let y = proposedY;
  const radius = computeSystemRadius(targetStar);

  for (let iteration = 0; iteration < 8; iteration += 1) {
    let overlapped = false;
    for (const other of otherStars) {
      if (!other) continue;
      const otherRadius = computeSystemRadius(other);
      const dx = x - other.x;
      const dy = y - other.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = radius + otherRadius;
      if (distance < minDistance) {
        overlapped = true;
        const separation = minDistance - distance;
        const directionX = distance === 0 ? Math.random() - 0.5 : dx / distance;
        const directionY = distance === 0 ? Math.random() - 0.5 : dy / distance;
        x += directionX * (separation + 1);
        y += directionY * (separation + 1);
      }
    }
    if (!overlapped) break;
  }

  return { x, y };
}


