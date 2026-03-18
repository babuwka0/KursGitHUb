import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function BoardGameData() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/boardgames/${id}`).then((res) => setGame(res.data)).catch(() => {});
  }, [id]);

  if (!game) return <div style={{ color: "var(--text-muted)" }}>Загрузка...</div>;

  return (
    <div>
      <Link to="/games" style={{ fontSize: 13, marginBottom: 16, display: "inline-block" }}>
        ← Назад к каталогу
      </Link>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>{game.title}</h2>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {game.imageUrl && (
          <div style={{ maxHeight: 400, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <img
              src={`http://localhost:8080/uploads/${game.imageUrl}`}
              alt={game.title}
              style={{ maxWidth: "100%", maxHeight: 368, objectFit: "contain" }}
            />
          </div>
        )}
        <div style={{ padding: 24 }}>
          <p style={{ marginBottom: 8 }}>{game.description}</p>
          <p style={{ marginBottom: 4, fontSize: 14 }}>
            Игроков: {game.minPlayers}–{game.maxPlayers}
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>Сложность: {game.complexity}</p>
        </div>
      </div>
    </div>
  );
}
