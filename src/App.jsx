// src/App.jsx
import React, { useState, useEffect } from "react";
import WishlistCard from "./components/WishlistCard";
import SortableItem from "./components/SortableItem";
import "./styles/App.css";
import Loader from "./components/Loader";
import { parseTemuLink } from "./utils/parserTemu.js";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

function App() {
  const [url, setUrl] = useState("");
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(items));
  }, [items]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAdd = () => {
    if (!url.trim()) return;
    if (items.some((item) => item.url === url.trim())) {
      alert("Link già presente nella lista.");
      return;
    }
    setLoading(true);
    try {
      const data = parseTemuLink(url.trim());
      if (!data) {
        return;
      }

      const newItem = {
        id: crypto.randomUUID(),
        title: data.title,
        image: data.image,
        url: data.url,
      };

      setItems((prev) => [...prev, newItem]);
      setUrl("");
    } catch (err) {
      console.error("Errore durante il parsing:", err);
      alert("Errore durante il parsing del link.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleExport = () => {
    const lines = items.map(
      (item, idx) => `Item #${idx + 1}\nnome: ${item.title}\nurl: ${item.url}\n`
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "wishlist.txt";
    a.click();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="app">
      {loading && <Loader />}
      <h1>Temu Wishlist</h1>
      <div className="input-row">
        <input
          type="text"
          placeholder="Incolla link Temu qui"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleAdd}>Aggiungi</button>
        <button onClick={handleExport}>Esporta lista</button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="wishlist">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default App;
