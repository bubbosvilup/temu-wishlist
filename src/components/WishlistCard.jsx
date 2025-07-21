// src/components/WishlistCard.jsx
import React from "react";
import "../styles/Wishlistcard.css";

function WishlistCard({ title, image, url, onRemove }) {
  return (
    <div className="wishlist-card">
      <button className="remove-btn" onClick={onRemove} type="button">
        ❌
      </button>
      <img src={image} alt={title} />
      <p>{title}</p>
      <a
        href={url}
        className="wishlist-card-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vai al prodotto
      </a>
    </div>
  );
}

export default WishlistCard;
