import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export default function useColumnManager(key, initialColumns) {
  const LOCAL_KEY = `${key}_column_order`;

  // Restore from localStorage OR use default list
  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : initialColumns;
  });

  // Which columns are visible?
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  // DnD active column
  const [activeId, setActiveId] = useState(null);

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        const newOrder = arrayMove(prev, oldIndex, newIndex);

        localStorage.setItem(LOCAL_KEY, JSON.stringify(newOrder));
        return newOrder;
      });
    }
  };

  return {
    columnOrder,
    visibleColumns,
    setVisibleColumns,
    activeId,
    setActiveId,
    handleDragEnd,
  };
}
