const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
let db;
let votingData = {};
//let serverProcess;

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        maxWidth: 1920,
        maxHeight: 1080,
        resizable: true,
        movable: true,
        closable: true,
        minimizable: true,
        maximizable: true,
        frame: true,
        transparent: false,
        title: "UrVote",
        icon: "assets/logos/urvote/Logo.png",
        fullscreen: false,
        fullscreenable: true,
        kiosk: false,
        autoHideMenuBar: true,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            spellcheck: true,
            contextIsolation: true, 
            preload: path.join(__dirname, "preload/SQLite.js")
        }
    });

    win.loadFile("preload/Load.html");

    win.webContents.on("context-menu", (event, params) => {
        const menu = Menu.buildFromTemplate([
            { role: "cut", label: "Cortar" },
            { role: "copy", label: "Copiar" },
            { role: "paste", label: "Pegar" },
            { type: "separator" },
            { role: "selectAll", label: "Seleccionar todo" }
        ]);
        menu.popup();
    });
});

//app.on("window-all-closed", () => {
    
    
//  if (serverProcess) serverProcess.kill();
//  if (process.platform !== "darwin") app.quit();
//});



app.whenReady().then(() => {
  BrowserWindow();
    });
  
    db = new sqlite3.Database(path.join(app.getPath('userData'), 'database.db'), (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Conectado a la db.');
      db.run(`CREATE TABLE IF NOT EXISTS savingdata(key TEXT PRIMARY KEY, value TEXT)`);
    });
  
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Se cerro la conexion a la db.');
    });
  });
  
  ipcMain.handle('db-save', async (event, key, value) => {
    return new Promise((resolve, reject) => {
      const jsonValue = JSON.stringify(value);
      const sql = `
        INSERT INTO savingdata (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `;
      db.run(sql, [key, jsonValue], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ message: "Dato guardado", key, value });
      });
    });
  });
  
  ipcMain.handle('db-get', async (event, key) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT value FROM savingdata WHERE key = ?", [key], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ key, value: row ? JSON.parse(row.value) : null });
      });
    });
  });
  
  ipcMain.handle('voting-save', async (event, key, value) => {
    votingData[key] = JSON.stringify(value);
    return { message: "Dato guardado temporalmente", key, value };
  });
  
  ipcMain.handle('voting-get', async (event, key) => {
    return { key, value: votingData[key] ? JSON.parse(votingData[key]) : null };
  });