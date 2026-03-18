import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { useNavigate, useSearchParams } from "react-router-dom";

const SERVICE_LABELS = {
  table: "Стол для настольных игр",
  room: "Комната для компании",
  movie: "Киновечер",
  karaoke: "Караоке",
  gaming: "Игровая зона",
};

export default function CreateBooking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type") || "";
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const url = typeFilter
      ? `http://localhost:8080/api/tables?type=${encodeURIComponent(typeFilter)}`
      : "http://localhost:8080/api/tables";
    axios.get(url, { headers: authHeader() }).then((res) => setTables(res.data)).catch(() => {});
  }, [typeFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      tableId: Number(selectedTable),
      startTime,
      endTime,
      gameCopyIds: [],
    };
    axios
      .post("http://localhost:8080/api/bookings", body, { headers: authHeader() })
      .then(() => navigate("/my-bookings"))
      .catch(() => setMessage("Ошибка при создании брони"));
  };

  const title = typeFilter && SERVICE_LABELS[typeFilter]
    ? `Забронировать: ${SERVICE_LABELS[typeFilter]}`
    : "Забронировать стол или комнату";

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>{title}</h2>
      <div style={{ marginBottom: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setSearchParams({})}
          style={{
            padding: "6px 12px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            background: !typeFilter ? "var(--primary)" : "var(--surface)",
            color: !typeFilter ? "#fff" : "var(--text)",
            cursor: "pointer",
          }}
        >
          Все
        </button>
        {Object.entries(SERVICE_LABELS).map(([type, label]) => (
          <button
            key={type}
            type="button"
            onClick={() => setSearchParams({ type })}
            style={{
              padding: "6px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: typeFilter === type ? "var(--primary)" : "var(--surface)",
              color: typeFilter === type ? "#fff" : "var(--text)",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 12, fontSize: 14, fontWeight: 500 }}>Стол или комната</label>
          {tables.length === 0 ? (
            <div style={{ padding: 16, background: "var(--bg)", borderRadius: 8, fontSize: 14, color: "var(--text-muted)" }}>
              Нет доступных столов. Попробуйте другой фильтр.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {tables.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTable(String(t.id))}
                  style={{
                    padding: 16,
                    border: `2px solid ${selectedTable === String(t.id) ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: selectedTable === String(t.id) ? "#fff7ed" : "var(--surface)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {t.imageUrl ? (
                    <img
                      src={`http://localhost:8080/uploads/${t.imageUrl}`}
                      alt={t.name}
                      style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: 160, background: "var(--bg)", borderRadius: 8, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 14 }}>
                      Нет фото
                    </div>
                  )}
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{t.capacity} чел.</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Начало</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Окончание</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
            }}
          />
        </div>
        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              fontSize: 13,
            }}
          >
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={tables.length === 0}
          style={{
            padding: "8px 16px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: tables.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Подтвердить
        </button>
      </form>
    </div>
  );
}
