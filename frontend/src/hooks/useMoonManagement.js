/* Custom hook for managing moon state and CRUD operations */

import { useMemo } from "react";

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

  // Add new todo
  const addTodo = (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    const newTodo = {
      id: Math.random().toString(36).slice(2, 9),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "medium",
      status: "active",
      dueDate: "",
      estimatedHours: "",
      tags: [],
      notes: "",
    };

    updateMoon((current) => {
      const currentTodos = current.todos || [];
      return { ...current, todos: [...currentTodos, newTodo] };
    });
  };

  // Toggle todo completion
  const toggleTodo = (todoId) => {
    updateMoon((current) => {
      const currentTodos = current.todos || [];
      const updatedTodos = currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );
      return { ...current, todos: updatedTodos };
    });
  };

  // Edit todo text
  const editTodo = (todoId, newText) => {
    if (!newText.trim()) return;
    updateMoon((current) => {
      const currentTodos = current.todos || [];
      const updatedTodos = currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, text: newText.trim() } : todo
      );
      return { ...current, todos: updatedTodos };
    });
  };

  // Update todo field
  const updateTodoField = (todoId, field, value) => {
    updateMoon((current) => {
      const currentTodos = current.todos || [];
      const updatedTodos = currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, [field]: value } : todo
      );
      return { ...current, todos: updatedTodos };
    });
  };

  // Delete todo
  const deleteTodo = (todoId) => {
    updateMoon((current) => {
      const currentTodos = current.todos || [];
      const updatedTodos = currentTodos.filter(todo => todo.id !== todoId);
      return { ...current, todos: updatedTodos };
    });
  };

  // Reorder todos
  const reorderTodos = (fromIndex, toIndex) => {
    updateMoon((current) => {
      const currentTodos = current.todos || [];
      if (fromIndex === toIndex) return current;
      
      const newTodos = [...currentTodos];
      const [movedTodo] = newTodos.splice(fromIndex, 1);
      newTodos.splice(toIndex, 0, movedTodo);
      
      return { ...current, todos: newTodos };
    });
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
    
    // Moon operations
    updateMoon,
    setMoonField,
  };
};
