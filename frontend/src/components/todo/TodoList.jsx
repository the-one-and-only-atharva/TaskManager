import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import TodoItem from "./TodoItem";
import { getMoonSvg } from "../../constants/space";

const TodoList = ({
  todos = [],
  onToggle,
  onEdit,
  onDelete,
  onUpdateField,
  onReorder,
  moonIconIndex = 0,
}) => {
  const [editingId, setEditingId] = useState(null);

  const handleEditStart = (id) => {
    setEditingId(id);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleEditSave = () => {
    setEditingId(null);
  };

  const handleReorder = (newOrder) => {
    onReorder(newOrder);
  };

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="w-16 h-16 mx-auto mb-4 opacity-30">
          <img
            src={getMoonSvg(moonIconIndex)}
            alt="Moon"
            className="w-full h-full filter drop-shadow-lg"
          />
        </div>
        <div className="text-white/50 text-lg font-medium mb-2">
          No tasks yet
        </div>
        <div className="text-white/30 text-sm">
          Start by adding your first task below
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <Reorder.Group
        axis="y"
        values={todos}
        onReorder={handleReorder}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {todos.map((todo, index) => (
            <Reorder.Item
              key={todo.id}
              value={todo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TodoItem
                todo={todo}
                index={moonIconIndex}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateField={onUpdateField}
                isEditing={editingId === todo.id}
                onEditStart={() => handleEditStart(todo.id)}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
              />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
};

export default TodoList;
