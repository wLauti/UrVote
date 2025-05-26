/*const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("database.db");

app.use(cors());
app.use(express.json());

let votingData = {};

// Endpoint para datos de votación (temporal)
app.post("/votingdata", (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: "Faltan parámetros 'key' o 'value'" });
  }
  votingData[key] = JSON.stringify(value);
  res.json({ message: "Dato guardado temporalmente", key, value });
});

app.get("/votingdata/:key", (req, res) => {
  const key = req.params.key;
  res.json({ key, value: votingData[key] ? JSON.parse(votingData[key]) : null });
});

// Creación de la tabla si no existe
db.run("CREATE TABLE IF NOT EXISTS savingdata (key TEXT PRIMARY KEY, value TEXT)", err => {
  if (err) console.error("Error al crear la tabla:", err);
});

// Endpoint para guardar datos en la base de datos (upsert)
app.post("/savingdata", (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: "Faltan parámetros 'key' o 'value'" });
  }
  const jsonValue = JSON.stringify(value);
  const sql = `
    INSERT INTO savingdata (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `;
  db.run(sql, [key, jsonValue], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Dato guardado", key, value });
  });
});

app.get("/savingdata/:key", (req, res) => {
  const key = req.params.key;
  db.get("SELECT value FROM savingdata WHERE key = ?", [key], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ key, value: row ? JSON.parse(row.value) : null });
  });
});

app.listen(3000, () => console.log("Iniciado en http://localhost:3000"));
*/
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveData: (key, value) => ipcRenderer.invoke('db-save', key, value),
  getData: (key) => ipcRenderer.invoke('db-get', key),
  getVotingData: (key) => ipcRenderer.invoke('voting-get', key),
  saveVotingData: (key, value) => ipcRenderer.invoke('voting-save', key, value),
});