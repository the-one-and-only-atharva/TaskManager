/* Custom hook for managing moon state and CRUD operations */

import { useMemo } from "react";
import { apiFetch } from "../lib/api.js";

export const useMoonManagement = (star, selectedItem, setStar) => {
  // Get the selected moon info
  const selectedMoonInfo = useMemo(() => {
    if (selectedItem?.type !== "moon") return { moon: null, planetIndex: -1, moonIndex: -1 };
    const planets = star?.planets ?? [];
    const planetIndex = selectedItem.planetIndex;
    const moonIndex = selectedItem.moonIndex;
    const planet = planets[planetIndex];
    const moon = planet?.moons?.[moonIndex];
    return { moon, planetIndex, moonIndex };
  }, [star, selectedItem]);

  const selectedMoon = selectedMoonInfo.moon;
  const planetIndex = selectedMoonInfo.planetIndex;
  const moonIndex = selectedMoonInfo.moonIndex;

  // No local input state needed; addTodo accepts text directly

  // Update moon function
  const updateMoon = (updater) => {
    if (selectedItem?.type !== "moon") return;
    if (planetIndex < 0 || moonIndex < 0) return;
    
    setStar?.((prev) => {
      const copy = { ...(prev || {}) };
      const planets = [...(copy.planets || [])];
      const planet = { ...(planets[planetIndex] || {}) };
      const moons = [...(planet.moons || [])];
      const current = { ...(moons[moonIndex] || {}) };
      
      const updated = typeof updater === "function" ? updater(current) : updater;
      moons[moonIndex] = updated;
      planet.moons = moons;
      planets[planetIndex] = planet;
      copy.planets = planets;
      
      return copy;
    });
  };

  // Set moon field
  const setMoonField = (field, value) => {
    updateMoon((current) => ({ ...current, [field]: value }));
  };

  // Add new todo (persisted)
  const addTodo = async (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    if (!selectedMoon?.id) return;
    try {
      const resp = await apiFetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ moon_id: selectedMoon.id, text: trimmed }),
      });
      const created = resp?.data;
      if (!created) return;
      updateMoon((current) => {
        const currentTodos = current.todos || [];
        return { ...current, todos: [...currentTodos, created] };
      });
    } catch (_) {
      // swallow; UI remains unchanged on failure
    }
  };

  // Toggle todo completion (persisted)
  const toggleTodo = async (todoId) => {
    try {
      const resp = await apiFetch(`/api/todos/${todoId}/toggle`, {
        method: "PATCH",
      });
      const updated = resp?.data;
      updateMoon((current) => {
        const currentTodos = current.todos || [];
        const updatedTodos = currentTodos.map((todo) =>
          todo.id === todoId ? { ...todo, ...updated } : todo
        );
        return { ...current, todos: updatedTodos };
      });
    } catch (_) {
      // ignore
    }
  };

  // Edit todo text (persisted)
  const editTodo = async (todoId, newText) => {
    const next = (newText || "").trim();
    if (!next) return;
    try {
      const resp = await apiFetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ text: next }),
      });
      const saved = resp?.data;
      updateMoon((current) => {
        const currentTodos = current.todos || [];
        const updatedTodos = currentTodos.map((todo) =>
          todo.id === todoId ? { ...todo, ...saved } : todo
        );
        return { ...current, todos: updatedTodos };
      });
    } catch (_) {
      // ignore
    }
  };

  // Update todo field (persisted)
  const updateTodoField = async (todoId, field, value) => {
    // Map UI field names to API schema
    const apiField =
      field === "dueDate"
        ? "due_date"
        : field === "estimatedHours"
        ? "estimated_hours"
        : field;
    try {
      const resp = await apiFetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ [apiField]: value }),
      });
      const saved = resp?.data;
      updateMoon((current) => {
        const currentTodos = current.todos || [];
        const updatedTodos = currentTodos.map((todo) =>
          todo.id === todoId ? { ...todo, ...saved } : todo
        );
        return { ...current, todos: updatedTodos };
      });
    } catch (_) {
      // ignore
    }
  };

  // Delete todo (persisted)
  const deleteTodo = async (todoId) => {
    try {
      await apiFetch(`/api/todos/${todoId}`, { method: "DELETE" });
      updateMoon((current) => {
        const currentTodos = current.todos || [];
        const updatedTodos = currentTodos.filter((todo) => todo.id !== todoId);
        return { ...current, todos: updatedTodos };
      });
    } catch (_) {
      // ignore
    }
  };

  // Reorder todos by drag indices (persist order on server)
  const reorderTodos = async (fromIndex, toIndex) => {
    updateMoon((current) => {
      const currentTodos = current.todos || [];
      if (fromIndex === toIndex) return current;
      const newTodos = [...currentTodos];
      const [movedTodo] = newTodos.splice(fromIndex, 1);
      newTodos.splice(toIndex, 0, movedTodo);
      return { ...current, todos: newTodos };
    });
    try {
      // After local reorder, inform server of the new order
      const todosAfter = (selectedMoon?.todos || []).map((t) => t.id);
      if (todosAfter.length > 0) {
        await apiFetch("/api/todos/reorder", {
          method: "PATCH",
          body: JSON.stringify({ todoIds: todosAfter }),
        });
      }
    } catch (_) {
      // ignore
    }
  };

  // Reorder todos by providing the complete new list (used by Reorder.Group)
  const reorderTodosByNewList = async (newOrder) => {
    updateMoon((current) => ({ ...current, todos: newOrder }));
    try {
      const ids = (newOrder || []).map((t) => t.id);
      if (ids.length > 0) {
        await apiFetch("/api/todos/reorder", {
          method: "PATCH",
          body: JSON.stringify({ todoIds: ids }),
        });
      }
    } catch (_) {
      // ignore
    }
  };

  // Get completion stats
  const todoStats = useMemo(() => {
    const todos = selectedMoon?.todos || [];
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, percentage };
  }, [selectedMoon]);

  // Delete moon function
  const deleteMoon = async () => {
    if (selectedItem?.type !== "moon") return;
    if (!selectedMoon?.id) return;
    
    try {
      // Make API call to delete moon
      await apiFetch(`/api/moons/${selectedMoon.id}`, {
        method: "DELETE",
      });
      
      // Update local state after successful deletion
      setStar?.((prev) => {
        const copy = { ...(prev || {}) };
        const planets = [...(copy.planets || [])];
        const planet = { ...(planets[planetIndex] || {}) };
        const moons = [...(planet.moons || [])];
        if (moonIndex >= 0) {
          moons.splice(moonIndex, 1);
          planet.moons = moons;
          planets[planetIndex] = planet;
        }
        copy.planets = planets;
        
        return copy;
      });
    } catch (error) {
      console.error("Failed to delete moon:", error);
      // You might want to show an error message to the user here
      throw error;
    }
  };

  return {
    // Selected moon info
    selectedMoon,
    planetIndex,
    moonIndex,
    
    // Todo stats
    todoStats,
    
    // Todo operations
    addTodo,
    toggleTodo,
    editTodo,
    updateTodoField,
    deleteTodo,
    reorderTodos,
    reorderTodosByNewList,
    
    // Moon operations
    updateMoon,
    setMoonField,
    deleteMoon,
  };
};
