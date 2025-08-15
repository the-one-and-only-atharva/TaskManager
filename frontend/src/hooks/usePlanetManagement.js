import { useState, useMemo } from "react";
import { apiFetch } from "../lib/api.js";

/**
 * Custom hook for managing planet state and CRUD operations
 */
export const usePlanetManagement = (star, selectedItem, setStar) => {
  // State for new items
  const [newOutcomeLabel, setNewOutcomeLabel] = useState("");
  const [newOutcomeTarget, setNewOutcomeTarget] = useState("");
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDue, setNewMilestoneDue] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  // Selected planet info
  const selectedPlanetInfo = useMemo(() => {
    if (selectedItem?.type !== "planet") return { planet: null, index: -1 };
    const planets = star?.planets ?? [];
    const byIdIndex = planets.findIndex((p) => p.id === selectedItem.planetId);
    const index = byIdIndex !== -1 ? byIdIndex : selectedItem.planetIndex;
    return { planet: planets[index] ?? null, index };
  }, [star, selectedItem]);

  const selectedPlanet = selectedPlanetInfo.planet;
  const selectedPlanetIndex = selectedPlanetInfo.index;

  const otherPlanets = useMemo(() => {
    return (star?.planets ?? []).map((p, idx) => ({ p, idx }));
  }, [star]);

  // Update functions
  const updatePlanet = (updater) => {
    if (selectedItem?.type !== "planet") return;
    const pIndex = selectedPlanetIndex;
    if (pIndex < 0) return;
    setStar?.((prev) => {
      const copy = { ...(prev || {}) };
      const planets = [...(copy.planets || [])];
      const current = { ...(planets[pIndex] || {}) };
      const updated =
        typeof updater === "function" ? updater(current) : updater;
      planets[pIndex] = updated;
      copy.planets = planets;
      return copy;
    });
  };

  const setPlanetField = (field, value) => {
    updatePlanet((current) => ({ ...current, [field]: value }));
  };

  const setStarField = (field, value) => {
    setStar?.((prev) => ({ ...(prev || {}), [field]: value }));
  };

  const reorderPlanet = (direction) => {
    if (selectedItem?.type !== "planet") return;
    const pIndex = selectedPlanetIndex;
    if (pIndex < 0) return;
    const newIndex = direction === "inward" ? pIndex - 1 : pIndex + 1;
    if (newIndex < 0) return;
    if (newIndex >= (star?.planets?.length ?? 0)) return;
    setStar?.((prev) => {
      const copy = { ...(prev || {}) };
      const planets = [...(copy.planets || [])];
      const [moved] = planets.splice(pIndex, 1);
      planets.splice(newIndex, 0, moved);
      copy.planets = planets;
      return copy;
    });
  };

  const toggleDependency = (planetId) => {
    if (!selectedPlanet) return;
    const current = selectedPlanet?.dependencies ?? [];
    const exists = current.includes(planetId);
    const next = exists
      ? current.filter((id) => id !== planetId)
      : [...current, planetId];
    setPlanetField("dependencies", next);
  };

  // CRUD operations for outcomes
  const addOutcome = () => {
    if (!newOutcomeLabel.trim()) return;
    const current = selectedPlanet?.outcomes ?? [];
    const next = [
      ...current,
      {
        id: Math.random().toString(36).slice(2, 9),
        label: newOutcomeLabel.trim(),
        target: newOutcomeTarget.trim(),
      },
    ];
    setPlanetField("outcomes", next);
    setNewOutcomeLabel("");
    setNewOutcomeTarget("");
  };

  const removeOutcome = (id) => {
    const current = selectedPlanet?.outcomes ?? [];
    setPlanetField(
      "outcomes",
      current.filter((o) => o.id !== id)
    );
  };

  // CRUD operations for milestones
  const addMilestone = () => {
    if (!newMilestoneName.trim()) return;
    const current = selectedPlanet?.milestones ?? [];
    const next = [
      ...current,
      {
        id: Math.random().toString(36).slice(2, 9),
        name: newMilestoneName.trim(),
        due: newMilestoneDue || null,
      },
    ];
    setPlanetField("milestones", next);
    setNewMilestoneName("");
    setNewMilestoneDue("");
  };

  const removeMilestone = (id) => {
    const current = selectedPlanet?.milestones ?? [];
    setPlanetField(
      "milestones",
      current.filter((m) => m.id !== id)
    );
  };

  // CRUD operations for links
  const addLink = () => {
    if (!newLinkUrl.trim()) return;
    const current = selectedPlanet?.links ?? [];
    const next = [
      ...current,
      {
        id: Math.random().toString(36).slice(2, 9),
        title: newLinkTitle.trim() || newLinkUrl.trim(),
        url: newLinkUrl.trim(),
      },
    ];
    setPlanetField("links", next);
    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const removeLink = (id) => {
    const current = selectedPlanet?.links ?? [];
    const next = current.filter((link) => link.id !== id);
    setPlanetField("links", next);
  };

  // Delete planet function
  const deletePlanet = async () => {
    if (selectedItem?.type !== "planet") return;
    if (!selectedPlanet?.id) return;
    
    try {
      // Make API call to delete planet
      await apiFetch(`/api/planets/${selectedPlanet.id}`, {
        method: "DELETE",
      });
      
      // Update local state after successful deletion
      setStar?.((prev) => {
        const copy = { ...(prev || {}) };
        const planets = [...(copy.planets || [])];
        const pIndex = selectedPlanetIndex;
        if (pIndex >= 0) {
          planets.splice(pIndex, 1);
          copy.planets = planets;
        }
        return copy;
      });
    } catch (error) {
      console.error("Failed to delete planet:", error);
      // You might want to show an error message to the user here
      throw error;
    }
  };

  // Tags management
  const tagsString = useMemo(
    () => (selectedPlanet?.tags || []).join(", "),
    [selectedPlanet]
  );
  
  const onTagsChange = (value) => {
    const list = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setPlanetField("tags", list);
  };

  return {
    selectedPlanet,
    selectedPlanetIndex,
    setPlanetField,
    setStarField,
    reorderPlanet,
    toggleDependency,
    otherPlanets,
    addOutcome,
    removeOutcome,
    newOutcomeLabel,
    setNewOutcomeLabel,
    newOutcomeTarget,
    setNewOutcomeTarget,
    addMilestone,
    removeMilestone,
    newMilestoneName,
    setNewMilestoneName,
    newMilestoneDue,
    setNewMilestoneDue,
    addLink,
    removeLink,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    tagsString,
    onTagsChange,
    deletePlanet,
  };
};
