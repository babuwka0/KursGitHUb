import React from "react";
import { Link } from "react-router-dom";

//жесть дипсик сделал иконки нормальные 
const icons = {
  table: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="4" rx="0.5" />
      <line x1="4" y1="12" x2="4" y2="20" />
      <line x1="20" y1="12" x2="20" y2="20" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  room: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  movie: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  ),
  karaoke: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  gaming: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  ),
};

const services = [
  { id: "table", title: "Забронировать стол", description: "Стол для настольных игр или общения.", type: "table" },
  { id: "room", title: "Комната", description: "Отдельная комната для компании.", type: "room" },
  { id: "movie", title: "Киновечер", description: "Большой экран, удобные кресла.", type: "movie" },
  { id: "karaoke", title: "Караоке", description: "Микрофоны и караоке-система.", type: "karaoke" },
  { id: "gaming", title: "Игровая зона", description: "PlayStation, Xbox и другие консоли.", type: "gaming" },
];

export default function Home() {
  return (
    <div>
      <h2 style={{ marginBottom: 8, fontSize: 20, fontWeight: 600 }}>Услуги</h2>
      <p style={{ marginBottom: 24, color: "var(--text-muted)", fontSize: 14 }}>
        Выберите услугу и забронируйте время
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {services.map((s) => (
          <Link
            key={s.id}
            to={`/book-table?type=${s.type}`}
            style={{
              display: "block",
              padding: 20,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
            }}
          >
            <div style={{ marginBottom: 12, color: "var(--primary)" }}>{icons[s.type]}</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
