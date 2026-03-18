import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8080/api/boardgames";

export default function ListBoardGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get(API).then((res) => setGames(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Каталог настольных игр</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {games.map((g) => (
          <div
            key={g.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {g.imageUrl ? (
              <div style={{ height: 220, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={`http://localhost:8080/uploads/${g.imageUrl}`}
                  alt={g.title}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
            ) : (
              <div
                style={{
                  height: 220,
                  background: "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                Нет фото
              </div>
            )}
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{g.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
                {g.minPlayers}–{g.maxPlayers} игроков · {g.complexity}
              </div>
              {g.description && (
                <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>{g.description}</p>
              )}
              <Link
                to={`/games/${g.id}`}
                style={{
                  fontSize: 13,
                  color: "var(--primary)",
                }}
              >
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
      {games.length === 0 && (
        <div style={{ padding: 24, color: "var(--text-muted)", fontSize: 14 }}>
          Игры пока не добавлены
        </div>
      )}
    </div>
  );
}
