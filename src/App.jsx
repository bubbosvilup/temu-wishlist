// src/App.jsx
import React, { useState } from "react";
import WishlistCard from "./components/WishlistCard";
import "./styles/App.css";
import Loader from "./components/Loader";

function App() {
  const [url, setUrl] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://temu-backend-exdo.onrender.com/parse?url=${encodeURIComponent(
          url
        )}`
      );
      const data = await res.json();

      if (!data.image || !data.title) {
        alert("Errore nel parsing del link.");
        return;
      }

      const newItem = {
        id: Date.now(),
        title: data.title,
        image: data.image,
        url: url,
      };

      setItems((prev) => [...prev, newItem]);
      setUrl("");
    } catch (err) {
      console.error("Errore durante il fetch:", err);
      alert("Errore durante il recupero dei dati.");
    } finally {
      setLoading(false);
    }
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
      </div>

      <div className="wishlist">
        {items.map((item) => (
          <WishlistCard
            key={item.id}
            title={item.title}
            image={item.image}
            url={item.url}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
