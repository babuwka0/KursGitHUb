import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";

const API = "http://localhost:8080/api/bookings";

const STATUS_LABELS = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждено",
  CANCELLED: "Отменено",
};

export default function AdminSchedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.append("from", dateFrom);
    if (dateTo) params.append("to", dateTo);
    axios
      .get(`${API}/admin/all?${params}`, { headers: authHeader() })
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo]);

  const setToday = () => {
    const d = new Date();
    const str = d.toISOString().split("T")[0];
    setDateFrom(str);
    setDateTo(str);
  };

  const setTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const str = d.toISOString().split("T")[0];
    setDateFrom(str);
    setDateTo(str);
  };

  const setWeek = () => {
    const d = new Date();
    setDateFrom(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 6);
    setDateTo(d.toISOString().split("T")[0]);
  };

  const groupByDate = (list) => {
    const groups = {};
    list.forEach((b) => {
      const dateStr = b.startTime ? new Date(b.startTime).toLocaleDateString("ru-RU") : "—";
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(b);
    });
    return groups;
  };

  const grouped = groupByDate(bookings);

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Расписание бронирований</h2>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>С</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>По</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={setToday}
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Сегодня
            </button>
            <button
              type="button"
              onClick={setTomorrow}
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Завтра
            </button>
            <button
              type="button"
              onClick={setWeek}
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Неделя
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Загрузка...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div
          style={{
            padding: 24,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 8,
            color: "#1e40af",
            fontSize: 14,
          }}
        >
          Нет бронирований за выбранный период
        </div>
      ) : (
        Object.entries(grouped).map(([dateStr, list]) => (
          <div
            key={dateStr}
            style={{
              marginBottom: 24,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: "var(--border)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {dateStr}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Стол/Комната</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Клиент</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Начало</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Конец</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: 12, fontSize: 14 }}>{b.tableArea?.name || "—"}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>{b.user?.username || "—"}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      {b.startTime ? new Date(b.startTime).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      {b.endTime ? new Date(b.endTime).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 12,
                          background:
                            b.status === "CONFIRMED"
                              ? "#dcfce7"
                              : b.status === "CANCELLED"
                              ? "#f3f4f6"
                              : "#fef3c7",
                          color:
                            b.status === "CONFIRMED"
                              ? "#166534"
                              : b.status === "CANCELLED"
                              ? "#6b7280"
                              : "#92400e",
                        }}
                      >
                        {STATUS_LABELS[b.status] || b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
