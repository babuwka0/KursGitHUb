import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";

const API = "http://localhost:8080/api/bookings";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(API, { headers: authHeader() }).then((res) => setBookings(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Мои бронирования</h2>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>№</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Стол/Комната</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Начало</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Конец</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 13 }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 12, fontSize: 14 }}>{i + 1}</td>
                <td style={{ padding: 12, fontSize: 14 }}>{b.tableArea?.name}</td>
                <td style={{ padding: 12, fontSize: 14 }}>{new Date(b.startTime).toLocaleString()}</td>
                <td style={{ padding: 12, fontSize: 14 }}>{new Date(b.endTime).toLocaleString()}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                      background: b.status === "CONFIRMED" ? "#dcfce7" : "#fef3c7",
                      color: b.status === "CONFIRMED" ? "#166534" : "#92400e",
                    }}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
            Нет активных бронирований
          </div>
        )}
      </div>
    </div>
  );
}
