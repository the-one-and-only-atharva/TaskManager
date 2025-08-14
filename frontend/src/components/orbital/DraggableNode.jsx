import React from "react";
import { useDraggable } from "@dnd-kit/core";

const DraggableNode = ({ id, x, y, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const translateX = (transform?.x ?? 0) + x;
  const translateY = (transform?.y ?? 0) + y;
  return (
    <g
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="draggable-node group"
      transform={`translate(${translateX} ${translateY})`}
      style={{ cursor: "grab" }}
    >
      {children}
    </g>
  );
};

export default DraggableNode;
