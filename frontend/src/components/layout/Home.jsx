import React from "react";
import ParallaxBackground from "./ParallaxBackground";
import HeroSection from "./HeroSection";
import HierarchySection from "./HierarchySection";

function Home() {
  return (
    <ParallaxBackground>
      <div className="min-h-screen flex flex-col">
        <HeroSection />
        <HierarchySection />
      </div>
    </ParallaxBackground>
  );
}

export default Home;
