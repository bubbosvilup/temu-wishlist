// components/SortableItem.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import WishlistCard from "./WishlistCard";

function SortableItem({ item, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <WishlistCard
        id={item.id}
        title={item.title}
        image={item.image}
        url={item.url}
        onRemove={onRemove}
      />
    </div>
  );
}

export default SortableItem;
