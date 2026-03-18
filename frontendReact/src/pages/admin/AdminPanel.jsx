import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../../services/auth-header";

const SERVICE_TYPES = [
  { value: "table", label: "Стол" },
  { value: "room", label: "Комната" },
  { value: "movie", label: "Киновечер" },
  { value: "karaoke", label: "Караоке" },
  { value: "gaming", label: "Игровая зона" },
];

export default function AdminPanel() {
  const [games, setGames] = useState([]);
  const [tables, setTables] = useState([]);
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [minPlayers, setMinPlayers] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [complexity, setComplexity] = useState("Легкая");
  const [gameImageUrl, setGameImageUrl] = useState("");
  const [editingGameId, setEditingGameId] = useState(null);
  const [gameMessage, setGameMessage] = useState("");
  const [expandedGameId, setExpandedGameId] = useState(null);
  const [gameCopies, setGameCopies] = useState({});
  const [newCopyStatus, setNewCopyStatus] = useState("available");
  const [newCopyInventory, setNewCopyInventory] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState(4);
  const [tableServiceType, setTableServiceType] = useState("table");
  const [tableImageUrl, setTableImageUrl] = useState("");
  const [editingTableId, setEditingTableId] = useState(null);
  const [tableMessage, setTableMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/boardgames").then((r) => setGames(r.data)).catch(() => {});
    axios.get("http://localhost:8080/api/tables").then((r) => setTables(r.data)).catch(() => {});
  }, []);

  const h = authHeader();

  const handleAddGame = (e) => {
    e.preventDefault();
    const data = {
      title: gameTitle,
      description: gameDescription,
      minPlayers,
      maxPlayers,
      complexity,
      imageUrl: gameImageUrl || null,
    };
    const req = editingGameId
      ? axios.put(`http://localhost:8080/api/boardgames/${editingGameId}`, data, { headers: h })
      : axios.post("http://localhost:8080/api/boardgames", data, { headers: h });
    req
      .then(() => {
        setGameMessage(editingGameId ? "Игра обновлена" : "Игра добавлена");
        setGameTitle("");
        setGameDescription("");
        setMinPlayers(1);
        setMaxPlayers(4);
        setComplexity("Легкая");
        setGameImageUrl("");
        setEditingGameId(null);
        return axios.get("http://localhost:8080/api/boardgames");
      })
      .then((r) => setGames(r.data))
      .catch(() => setGameMessage("Ошибка"));
  };

  const handleGameImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    axios.post("http://localhost:8080/api/upload", fd, { headers: h }).then((r) => setGameImageUrl(r.data.filename)).catch(() => setGameMessage("Ошибка загрузки"));
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    const data = {
      name: tableName,
      capacity: tableCapacity,
      serviceType: tableServiceType,
      imageUrl: tableImageUrl || null,
    };
    const req = editingTableId
      ? axios.put(`http://localhost:8080/api/tables/${editingTableId}`, data, { headers: h })
      : axios.post("http://localhost:8080/api/tables", data, { headers: h });
    req
      .then(() => {
        setTableMessage(editingTableId ? "Стол обновлён" : "Стол добавлен");
        setTableName("");
        setTableCapacity(4);
        setTableImageUrl("");
        setTableServiceType("table");
        setEditingTableId(null);
        return axios.get("http://localhost:8080/api/tables");
      })
      .then((r) => setTables(r.data))
      .catch(() => setTableMessage("Ошибка"));
  };

  const handleTableImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    axios.post("http://localhost:8080/api/upload", fd, { headers: h }).then((r) => setTableImageUrl(r.data.filename)).catch(() => setTableMessage("Ошибка загрузки"));
  };

  const startEditGame = (g) => {
    setEditingGameId(g.id);
    setGameTitle(g.title || "");
    setGameDescription(g.description || "");
    setMinPlayers(g.minPlayers || 1);
    setMaxPlayers(g.maxPlayers || 4);
    setComplexity(g.complexity || "Легкая");
    setGameImageUrl(g.imageUrl || "");
  };

  const toggleGameCopies = (gameId) => {
    if (expandedGameId === gameId) {
      setExpandedGameId(null);
    } else {
      setExpandedGameId(gameId);
      if (!gameCopies[gameId]) {
        axios.get(`http://localhost:8080/api/boardgames/${gameId}/copies`)
          .then((r) => setGameCopies((prev) => ({ ...prev, [gameId]: r.data })))
          .catch(() => setGameCopies((prev) => ({ ...prev, [gameId]: [] })));
      }
    }
  };

  const handleAddCopy = (e, gameId) => {
    e.preventDefault();
    setCopyMessage("");
    axios.post(`http://localhost:8080/api/boardgames/${gameId}/copies`, {
      status: newCopyStatus,
      inventoryNumber: newCopyInventory || null,
    }, { headers: h })
      .then(() => {
        setCopyMessage("Копия добавлена");
        setNewCopyInventory("");
        return axios.get(`http://localhost:8080/api/boardgames/${gameId}/copies`);
      })
      .then((r) => setGameCopies((prev) => ({ ...prev, [gameId]: r.data })))
      .catch(() => setCopyMessage("Ошибка"));
  };

  const handleDeleteCopy = (gameId, copyId) => {
    axios.delete(`http://localhost:8080/api/boardgames/${gameId}/copies/${copyId}`, { headers: h })
      .then(() => axios.get(`http://localhost:8080/api/boardgames/${gameId}/copies`))
      .then((r) => setGameCopies((prev) => ({ ...prev, [gameId]: r.data })))
      .catch(() => {});
  };

  const handleUpdateCopyStatus = (gameId, copyId, newStatus) => {
    axios.put(`http://localhost:8080/api/boardgames/${gameId}/copies/${copyId}`, { status: newStatus }, { headers: h })
      .then(() => axios.get(`http://localhost:8080/api/boardgames/${gameId}/copies`))
      .then((r) => setGameCopies((prev) => ({ ...prev, [gameId]: r.data })))
      .catch(() => setCopyMessage("Ошибка смены статуса"));
  };

  const startEditTable = (t) => {
    setEditingTableId(t.id);
    setTableName(t.name || "");
    setTableCapacity(t.capacity || 4);
    setTableServiceType(t.serviceType || "table");
    setTableImageUrl(t.imageUrl || "");
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid var(--border)",
    borderRadius: 6,
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Панель администратора</h2>
        <Link
          to="/admin/schedule"
          style={{
            padding: "8px 16px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 13,
            textDecoration: "none",
            color: "var(--text)",
          }}
        >
          Расписание бронирований
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Настольные игры</h3>
          <form onSubmit={handleAddGame}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Название</label>
              <input type="text" value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Описание</label>
              <textarea value={gameDescription} onChange={(e) => setGameDescription(e.target.value)} rows={3} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Мин. игроков</label>
                <input type="number" value={minPlayers} onChange={(e) => setMinPlayers(Number(e.target.value))} min={1} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Макс. игроков</label>
                <input type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(Number(e.target.value))} min={1} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Сложность</label>
              <select value={complexity} onChange={(e) => setComplexity(e.target.value)} style={inputStyle}>
                <option value="Легкая">Легкая</option>
                <option value="Средняя">Средняя</option>
                <option value="Сложная">Сложная</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Изображение</label>
              <input type="file" accept="image/*" onChange={handleGameImage} style={inputStyle} />
              {gameImageUrl && <img src={`http://localhost:8080/uploads/${gameImageUrl}`} alt="" style={{ marginTop: 8, maxHeight: 80, borderRadius: 6 }} />}
            </div>
            <button type="submit" style={{ padding: "8px 16px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
              {editingGameId ? "Обновить" : "Добавить"}
            </button>
            {gameMessage && <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>{gameMessage}</div>}
          </form>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            {games.map((g) => (
              <div key={g.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span>{g.title}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => toggleGameCopies(g.id)} style={{ padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 12 }}>
                      Копии {(gameCopies[g.id]?.length ?? 0) > 0 && `(${gameCopies[g.id].length})`}
                    </button>
                    <button type="button" onClick={() => startEditGame(g)} style={{ padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 12 }}>
                      Редактировать
                    </button>
                  </div>
                </div>
                {expandedGameId === g.id && (
                  <div style={{ marginTop: 12, padding: 12, background: "var(--bg)", borderRadius: 6 }}>
                    <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Копии игры</div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {(gameCopies[g.id] || []).map((copy) => (
                        <li key={copy.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13 }}>#{copy.id} {copy.inventoryNumber && `(${copy.inventoryNumber})`}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <select
                              value={copy.status}
                              onChange={(e) => handleUpdateCopyStatus(g.id, copy.id, e.target.value)}
                              style={{ ...inputStyle, width: 110, padding: "4px 8px", fontSize: 12 }}
                            >
                              <option value="available">Доступна</option>
                              <option value="in_use">На столе</option>
                              <option value="maintenance">В ремонте</option>
                            </select>
                            <button type="button" onClick={() => handleDeleteCopy(g.id, copy.id)} style={{ padding: "2px 8px", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 12 }}>
                              Удалить
                            </button>
                          </div>
                        </li>
                      ))}
                      {(gameCopies[g.id] || []).length === 0 && (
                        <li style={{ padding: 8, color: "var(--text-muted)", fontSize: 13 }}>Нет копий</li>
                      )}
                    </ul>
                    <form onSubmit={(e) => handleAddCopy(e, g.id)} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end", marginTop: 12 }}>
                      <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>Статус</label>
                        <select value={newCopyStatus} onChange={(e) => setNewCopyStatus(e.target.value)} style={{ ...inputStyle, width: 120 }}>
                          <option value="available">Доступна</option>
                          <option value="in_use">На столе</option>
                          <option value="maintenance">В ремонте</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>Инв. номер</label>
                        <input type="text" placeholder="INV-001" value={newCopyInventory} onChange={(e) => setNewCopyInventory(e.target.value)} style={{ ...inputStyle, width: 100 }} />
                      </div>
                      <button type="submit" style={{ padding: "6px 12px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                        Добавить копию
                      </button>
                    </form>
                    {copyMessage && <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>{copyMessage}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Столы и комнаты</h3>
          <form onSubmit={handleAddTable}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Название</label>
              <input type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Вместимость</label>
              <input type="number" value={tableCapacity} onChange={(e) => setTableCapacity(Number(e.target.value))} min={1} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Тип</label>
              <select value={tableServiceType} onChange={(e) => setTableServiceType(e.target.value)} style={inputStyle}>
                {SERVICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Изображение</label>
              <input type="file" accept="image/*" onChange={handleTableImage} style={inputStyle} />
              {tableImageUrl && <img src={`http://localhost:8080/uploads/${tableImageUrl}`} alt="" style={{ marginTop: 8, maxHeight: 80, borderRadius: 6 }} />}
            </div>
            <button type="submit" style={{ padding: "8px 16px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
              {editingTableId ? "Обновить" : "Добавить"}
            </button>
            {tableMessage && <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>{tableMessage}</div>}
          </form>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            {tables.map((t) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span>{t.name} ({t.capacity} чел.)</span>
                <button type="button" onClick={() => startEditTable(t)} style={{ padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 12 }}>
                  Редактировать
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
